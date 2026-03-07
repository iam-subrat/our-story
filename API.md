# API Documentation

Base URL: `http://localhost:8080` (development)

## Endpoints

### Create Story

**POST** `/api/stories`

Create a new story.

**Request Body:**
```json
{
  "title": "Summer Trip 2024",
  "creator_name": "John Doe",
  "album_link": "https://photos.app.goo.gl/..." // optional
}
```

**Response:**
```json
{
  "id": "abc12345",
  "title": "Summer Trip 2024",
  "creator_name": "John Doe",
  "album_link": "https://photos.app.goo.gl/...",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### Get Story

**GET** `/api/stories/:id`

Retrieve story details.

**Response:**
```json
{
  "id": "abc12345",
  "title": "Summer Trip 2024",
  "creator_name": "John Doe",
  "album_link": "https://photos.app.goo.gl/...",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### Get Photos

**GET** `/api/photos?story_id=:id`

Get all photos for a story (ordered by newest first).

**Response:**
```json
[
  {
    "id": "photo-uuid",
    "story_id": "abc12345",
    "image_url": "/uploads/filename.jpg",
    "caption": "Beautiful sunset",
    "uploaded_by": "Jane Smith",
    "timestamp": "2024-01-15T11:00:00Z"
  }
]
```

---

### Upload Photo

**POST** `/api/upload`

Upload a photo to a story.

**Request:** `multipart/form-data`

**Fields:**
- `photo` (file) - Image file (max 5MB)
- `story_id` (string) - Story ID
- `caption` (string) - Photo caption (optional)
- `uploaded_by` (string) - Name of uploader

**Response:**
```json
{
  "id": "photo-uuid",
  "story_id": "abc12345",
  "image_url": "/uploads/filename.jpg",
  "caption": "Beautiful sunset",
  "uploaded_by": "Jane Smith",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

---

### Static Files

**GET** `/uploads/:filename`

Serve uploaded images.

---

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `500` - Internal Server Error

**Error Format:**
```json
{
  "error": "Error message"
}
```

## CORS

All endpoints support CORS with:
- Origin: `*`
- Methods: `GET, POST, OPTIONS`
- Headers: `Content-Type`

## Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- 10 story creations per IP per hour
- 50 photo uploads per IP per hour
