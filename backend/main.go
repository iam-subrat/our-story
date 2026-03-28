package main

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

var jwtSecret = []byte(func() string {
	if s := os.Getenv("JWT_SECRET"); s != "" {
		return s
	}
	return "dev-secret-change-in-production"
}())

type User struct {
	ID          string `json:"id"`
	Username    string `json:"username"`
	DisplayName string `json:"display_name"`
}

type Story struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	CreatorName string    `json:"creator_name"`
	UserID      string    `json:"user_id"`
	AlbumLink   string    `json:"album_link"`
	StoryDate   string    `json:"story_date"`
	CreatedAt   time.Time `json:"created_at"`
}

type Photo struct {
	ID         string    `json:"id"`
	StoryID    string    `json:"story_id"`
	ImageURL   string    `json:"image_url"`
	Caption    string    `json:"caption"`
	UploadedBy string    `json:"uploaded_by"`
	Timestamp  time.Time `json:"timestamp"`
}

// ---------- DB init & migration ----------

func initDB() {
	var err error
	db, err = sql.Open("sqlite3", "./ourstory.db")
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id           TEXT PRIMARY KEY,
			username     TEXT UNIQUE NOT NULL,
			display_name TEXT NOT NULL,
			password_hash TEXT
		);
		CREATE TABLE IF NOT EXISTS stories (
			id           TEXT PRIMARY KEY,
			title        TEXT NOT NULL,
			creator_name TEXT NOT NULL,
			user_id      TEXT,
			album_link   TEXT,
			story_date   DATETIME DEFAULT CURRENT_TIMESTAMP,
			created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY(user_id) REFERENCES users(id)
		);
		CREATE TABLE IF NOT EXISTS photos (
			id          TEXT PRIMARY KEY,
			story_id    TEXT NOT NULL,
			image_url   TEXT NOT NULL,
			caption     TEXT,
			uploaded_by TEXT NOT NULL,
			timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY(story_id) REFERENCES stories(id)
		);
	`)
	if err != nil {
		log.Fatal(err)
	}

	// Add user_id column to stories if it doesn't exist yet (existing DBs)
	db.Exec(`ALTER TABLE stories ADD COLUMN user_id TEXT REFERENCES users(id)`)

	migrateExistingCreators()
	os.MkdirAll("./uploads", 0755)
}

var slugRe = regexp.MustCompile(`[^a-z0-9]+`)

func slugify(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = slugRe.ReplaceAllString(s, "-")
	return strings.Trim(s, "-")
}

func migrateExistingCreators() {
	rows, err := db.Query(`SELECT DISTINCT creator_name FROM stories WHERE user_id IS NULL`)
	if err != nil {
		log.Println("migration query error:", err)
		return
	}
	defer rows.Close()

	var names []string
	for rows.Next() {
		var name string
		rows.Scan(&name)
		names = append(names, name)
	}

	for _, name := range names {
		base := slugify(name)
		if base == "" {
			base = "user"
		}
		username := base
		// ensure unique username
		for i := 2; ; i++ {
			var exists int
			db.QueryRow(`SELECT COUNT(*) FROM users WHERE username = ?`, username).Scan(&exists)
			if exists == 0 {
				break
			}
			username = base + "-" + string(rune('0'+i))
		}

		userID := uuid.New().String()
		_, err := db.Exec(`INSERT OR IGNORE INTO users (id, username, display_name, password_hash) VALUES (?, ?, ?, NULL)`,
			userID, username, name)
		if err != nil {
			log.Println("migration insert user error:", err)
			continue
		}
		// fetch the actual inserted id (in case of race / already existed)
		var uid string
		db.QueryRow(`SELECT id FROM users WHERE username = ?`, username).Scan(&uid)

		db.Exec(`UPDATE stories SET user_id = ? WHERE creator_name = ? AND user_id IS NULL`, uid, name)
		log.Printf("migrated creator %q → username %q", name, username)
	}
}

// ---------- helpers ----------

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

func makeToken(userID string) (string, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(30 * 24 * time.Hour).Unix(),
	})
	return t.SignedString(jwtSecret)
}

func userIDFromRequest(r *http.Request) (string, bool) {
	auth := r.Header.Get("Authorization")
	if !strings.HasPrefix(auth, "Bearer ") {
		return "", false
	}
	t, err := jwt.Parse(strings.TrimPrefix(auth, "Bearer "), func(t *jwt.Token) (any, error) {
		return jwtSecret, nil
	})
	if err != nil || !t.Valid {
		return "", false
	}
	claims, ok := t.Claims.(jwt.MapClaims)
	if !ok {
		return "", false
	}
	sub, _ := claims["sub"].(string)
	return sub, sub != ""
}

// ---------- auth handlers ----------

func registerHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}
	var body struct {
		Username    string `json:"username"`
		Password    string `json:"password"`
		DisplayName string `json:"display_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Username == "" || body.Password == "" {
		http.Error(w, "username and password required", http.StatusBadRequest)
		return
	}
	body.Username = slugify(body.Username)
	if body.DisplayName == "" {
		body.DisplayName = body.Username
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "server error", http.StatusInternalServerError)
		return
	}

	id := uuid.New().String()
	_, err = db.Exec(`INSERT INTO users (id, username, display_name, password_hash) VALUES (?, ?, ?, ?)`,
		id, body.Username, body.DisplayName, string(hash))
	if err != nil {
		http.Error(w, "username already taken", http.StatusConflict)
		return
	}

	token, _ := makeToken(id)
	writeJSON(w, map[string]any{"token": token, "user": User{ID: id, Username: body.Username, DisplayName: body.DisplayName}})
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	var u User
	var hash sql.NullString
	err := db.QueryRow(`SELECT id, username, display_name, password_hash FROM users WHERE username = ?`, slugify(body.Username)).
		Scan(&u.ID, &u.Username, &u.DisplayName, &hash)
	if err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	if !hash.Valid {
		// unclaimed migrated account
		http.Error(w, "account_unclaimed", http.StatusForbidden)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash.String), []byte(body.Password)); err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	token, _ := makeToken(u.ID)
	writeJSON(w, map[string]any{"token": token, "user": u})
}

func claimHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Username == "" || body.Password == "" {
		http.Error(w, "username and password required", http.StatusBadRequest)
		return
	}

	var u User
	var hash sql.NullString
	err := db.QueryRow(`SELECT id, username, display_name, password_hash FROM users WHERE username = ?`, slugify(body.Username)).
		Scan(&u.ID, &u.Username, &u.DisplayName, &hash)
	if err != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}
	if hash.Valid {
		http.Error(w, "account already claimed", http.StatusConflict)
		return
	}

	newHash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "server error", http.StatusInternalServerError)
		return
	}
	db.Exec(`UPDATE users SET password_hash = ? WHERE id = ?`, string(newHash), u.ID)

	token, _ := makeToken(u.ID)
	writeJSON(w, map[string]any{"token": token, "user": u})
}

func meHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}
	userID, ok := userIDFromRequest(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	var u User
	err := db.QueryRow(`SELECT id, username, display_name FROM users WHERE id = ?`, userID).
		Scan(&u.ID, &u.Username, &u.DisplayName)
	if err != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}
	writeJSON(w, u)
}

// lookup username → return user info (public, for timeline page)
func userByUsernameHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	username := strings.TrimPrefix(r.URL.Path, "/api/users/")
	var u User
	err := db.QueryRow(`SELECT id, username, display_name FROM users WHERE username = ?`, username).
		Scan(&u.ID, &u.Username, &u.DisplayName)
	if err != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}
	writeJSON(w, u)
}

// ---------- story handlers ----------

func storiesHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}

	if r.Method == "GET" {
		// GET /api/stories?username=  — protected, own stories only
		username := r.URL.Query().Get("username")
		if username == "" {
			writeJSON(w, []Story{})
			return
		}
		userID, ok := userIDFromRequest(r)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		// verify the requested username belongs to the token owner
		var ownerID string
		db.QueryRow(`SELECT id FROM users WHERE username = ?`, username).Scan(&ownerID)
		if ownerID != userID {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
		getStoriesByUserID(w, userID)
		return
	}

	// POST — create story, requires auth
	userID, ok := userIDFromRequest(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var story Story
	if err := json.NewDecoder(r.Body).Decode(&story); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var u User
	db.QueryRow(`SELECT id, username, display_name FROM users WHERE id = ?`, userID).
		Scan(&u.ID, &u.Username, &u.DisplayName)

	story.ID = uuid.New().String()[:8]
	story.CreatedAt = time.Now()
	story.CreatorName = u.DisplayName
	story.UserID = userID
	if story.StoryDate == "" {
		story.StoryDate = time.Now().Format("2006-01-02")
	}

	_, err := db.Exec(`INSERT INTO stories (id, title, creator_name, user_id, album_link, story_date) VALUES (?, ?, ?, ?, ?, ?)`,
		story.ID, story.Title, story.CreatorName, story.UserID, story.AlbumLink, story.StoryDate)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, story)
}

func storyHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	id := strings.TrimPrefix(r.URL.Path, "/api/stories/")

	if r.Method == "PUT" {
		userID, ok := userIDFromRequest(r)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		var ownerID string
		db.QueryRow(`SELECT user_id FROM stories WHERE id = ?`, id).Scan(&ownerID)
		if ownerID != userID {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
		updateStory(w, r, id)
		return
	}

	// GET — public
	var story Story
	err := db.QueryRow(`SELECT id, title, creator_name, COALESCE(user_id,''), album_link, story_date, created_at FROM stories WHERE id = ?`, id).
		Scan(&story.ID, &story.Title, &story.CreatorName, &story.UserID, &story.AlbumLink, &story.StoryDate, &story.CreatedAt)
	if err != nil {
		http.Error(w, "Story not found", http.StatusNotFound)
		return
	}
	writeJSON(w, story)
}

func updateStory(w http.ResponseWriter, r *http.Request, id string) {
	var body struct {
		AlbumLink string `json:"album_link"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	db.Exec(`UPDATE stories SET album_link = ? WHERE id = ?`, body.AlbumLink, id)

	var story Story
	db.QueryRow(`SELECT id, title, creator_name, COALESCE(user_id,''), album_link, story_date, created_at FROM stories WHERE id = ?`, id).
		Scan(&story.ID, &story.Title, &story.CreatorName, &story.UserID, &story.AlbumLink, &story.StoryDate, &story.CreatedAt)
	writeJSON(w, story)
}

func getStoriesByUserID(w http.ResponseWriter, userID string) {
	rows, err := db.Query(`SELECT id, title, creator_name, COALESCE(user_id,''), album_link, story_date, created_at FROM stories WHERE user_id = ? ORDER BY story_date DESC`, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	stories := []Story{}
	for rows.Next() {
		var s Story
		rows.Scan(&s.ID, &s.Title, &s.CreatorName, &s.UserID, &s.AlbumLink, &s.StoryDate, &s.CreatedAt)
		stories = append(stories, s)
	}
	writeJSON(w, stories)
}

// ---------- photo handlers ----------

func getPhotos(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	storyID := r.URL.Query().Get("story_id")

	rows, err := db.Query(`SELECT id, story_id, image_url, caption, uploaded_by, timestamp FROM photos WHERE story_id = ? ORDER BY timestamp DESC`, storyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	photos := []Photo{}
	for rows.Next() {
		var p Photo
		rows.Scan(&p.ID, &p.StoryID, &p.ImageURL, &p.Caption, &p.UploadedBy, &p.Timestamp)
		photos = append(photos, p)
	}
	writeJSON(w, photos)
}

func uploadPhoto(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}

	r.ParseMultipartForm(5 << 20)

	file, header, err := r.FormFile("photo")
	if err != nil {
		http.Error(w, "Invalid file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	if !strings.HasPrefix(header.Header.Get("Content-Type"), "image/") {
		http.Error(w, "Only images allowed", http.StatusBadRequest)
		return
	}

	filename := uuid.New().String() + filepath.Ext(header.Filename)
	dst, err := os.Create(filepath.Join("./uploads", filename))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()
	io.Copy(dst, file)

	photo := Photo{
		ID:         uuid.New().String(),
		StoryID:    r.FormValue("story_id"),
		ImageURL:   "/uploads/" + filename,
		Caption:    r.FormValue("caption"),
		UploadedBy: r.FormValue("uploaded_by"),
		Timestamp:  time.Now(),
	}

	_, err = db.Exec(`INSERT INTO photos (id, story_id, image_url, caption, uploaded_by) VALUES (?, ?, ?, ?, ?)`,
		photo.ID, photo.StoryID, photo.ImageURL, photo.Caption, photo.UploadedBy)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, photo)
}

func deletePhotoHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}
	if r.Method != "DELETE" {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := userIDFromRequest(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	photoID := strings.TrimPrefix(r.URL.Path, "/api/photos/")
	if photoID == "" {
		http.Error(w, "photo id required", http.StatusBadRequest)
		return
	}

	// Fetch photo and verify the requester owns the parent story
	var imageURL, storyID string
	err := db.QueryRow(`SELECT image_url, story_id FROM photos WHERE id = ?`, photoID).
		Scan(&imageURL, &storyID)
	if err != nil {
		http.Error(w, "photo not found", http.StatusNotFound)
		return
	}

	var ownerID string
	db.QueryRow(`SELECT user_id FROM stories WHERE id = ?`, storyID).Scan(&ownerID)
	if ownerID != userID {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	// Delete from DB
	_, err = db.Exec(`DELETE FROM photos WHERE id = ?`, photoID)
	if err != nil {
		http.Error(w, "failed to delete photo", http.StatusInternalServerError)
		return
	}

	// Delete file from disk (best-effort)
	if imageURL != "" {
		filePath := "." + imageURL // e.g. /uploads/abc.jpg → ./uploads/abc.jpg
		os.Remove(filePath)
	}

	w.WriteHeader(http.StatusNoContent)
}

// ---------- main ----------

func main() {
	initDB()
	defer db.Close()

	http.HandleFunc("/api/auth/register", registerHandler)
	http.HandleFunc("/api/auth/login", loginHandler)
	http.HandleFunc("/api/auth/claim", claimHandler)
	http.HandleFunc("/api/auth/me", meHandler)
	http.HandleFunc("/api/users/", userByUsernameHandler)
	http.HandleFunc("/api/stories", storiesHandler)
	http.HandleFunc("/api/stories/", storyHandler)
	http.HandleFunc("/api/photos", getPhotos)
	http.HandleFunc("/api/photos/", deletePhotoHandler)
	http.HandleFunc("/api/upload", uploadPhoto)
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server running on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
