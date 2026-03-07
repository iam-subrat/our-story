package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

type Story struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	CreatorName string `json:"creator_name"`
	AlbumLink   string `json:"album_link"`
	StoryDate   string `json:"story_date"`
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

func initDB() {
	var err error
	db, err = sql.Open("sqlite3", "./ourstory.db")
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS stories (
			id TEXT PRIMARY KEY,
			title TEXT NOT NULL,
			creator_name TEXT NOT NULL,
			album_link TEXT,
			story_date DATETIME DEFAULT CURRENT_TIMESTAMP,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);
		CREATE TABLE IF NOT EXISTS photos (
			id TEXT PRIMARY KEY,
			story_id TEXT NOT NULL,
			image_url TEXT NOT NULL,
			caption TEXT,
			uploaded_by TEXT NOT NULL,
			timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY(story_id) REFERENCES stories(id)
		);
	`)
	if err != nil {
		log.Fatal(err)
	}
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func createStory(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}

	// Check if this is a GET request with creator_name query
	if r.Method == "GET" {
		creatorName := r.URL.Query().Get("creator_name")
		if creatorName != "" {
			getStoriesByCreator(w, creatorName)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]Story{})
		return
	}

	var story Story
	if err := json.NewDecoder(r.Body).Decode(&story); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	story.ID = uuid.New().String()[:8]
	story.CreatedAt = time.Now()
	if story.StoryDate == "" {
		story.StoryDate = time.Now().Format("2006-01-02")
	}

	_, err := db.Exec("INSERT INTO stories (id, title, creator_name, album_link, story_date) VALUES (?, ?, ?, ?, ?)",
		story.ID, story.Title, story.CreatorName, story.AlbumLink, story.StoryDate)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(story)
}

func getStory(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	id := strings.TrimPrefix(r.URL.Path, "/api/stories/")

	// Handle PUT request to update story
	if r.Method == "PUT" {
		updateStory(w, r, id)
		return
	}

	var story Story
	err := db.QueryRow("SELECT id, title, creator_name, album_link, story_date, created_at FROM stories WHERE id = ?", id).
		Scan(&story.ID, &story.Title, &story.CreatorName, &story.AlbumLink, &story.StoryDate, &story.CreatedAt)
	if err != nil {
		http.Error(w, "Story not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(story)
}

func updateStory(w http.ResponseWriter, r *http.Request, id string) {
	var story Story
	if err := json.NewDecoder(r.Body).Decode(&story); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err := db.Exec("UPDATE stories SET album_link = ? WHERE id = ?", story.AlbumLink, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return updated story
	err = db.QueryRow("SELECT id, title, creator_name, album_link, story_date, created_at FROM stories WHERE id = ?", id).
		Scan(&story.ID, &story.Title, &story.CreatorName, &story.AlbumLink, &story.StoryDate, &story.CreatedAt)
	if err != nil {
		http.Error(w, "Story not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(story)
}

func getStoriesByCreator(w http.ResponseWriter, creatorName string) {
	rows, err := db.Query("SELECT id, title, creator_name, album_link, story_date, created_at FROM stories WHERE creator_name = ? ORDER BY story_date DESC", creatorName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	stories := []Story{}
	for rows.Next() {
		var s Story
		rows.Scan(&s.ID, &s.Title, &s.CreatorName, &s.AlbumLink, &s.StoryDate, &s.CreatedAt)
		stories = append(stories, s)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stories)
}

func getPhotos(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	storyID := r.URL.Query().Get("story_id")

	rows, err := db.Query("SELECT id, story_id, image_url, caption, uploaded_by, timestamp FROM photos WHERE story_id = ? ORDER BY timestamp DESC", storyID)
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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(photos)
}

func addPhotoMetadata(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}

	var photo Photo
	if err := json.NewDecoder(r.Body).Decode(&photo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	photo.ID = uuid.New().String()
	photo.Timestamp = time.Now()

	_, err := db.Exec("INSERT INTO photos (id, story_id, image_url, caption, uploaded_by) VALUES (?, ?, ?, ?, ?)",
		photo.ID, photo.StoryID, photo.ImageURL, photo.Caption, photo.UploadedBy)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(photo)
}

func main() {
	initDB()
	defer db.Close()

	http.HandleFunc("/api/stories", createStory)
	http.HandleFunc("/api/stories/", getStory)
	http.HandleFunc("/api/photos", getPhotos)
	http.HandleFunc("/api/photos/add", addPhotoMetadata)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server running on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
