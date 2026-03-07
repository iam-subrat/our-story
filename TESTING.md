# Testing Guide

## Local Development Testing

### 1. Start the Application

```bash
# Terminal 1: Backend
cd backend
go run main.go

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Or use the dev script:
```bash
./dev.sh
```

### 2. Test Story Creation

1. Open http://localhost:5173
2. Click "Create Your Story"
3. Fill in:
   - Title: "Test Story"
   - Name: "Test User"
   - Album Link: (optional) any Google Photos public link
4. Click "Create Story"
5. Verify redirect to story page with unique ID

### 3. Test Photo Upload

1. On story page, click "+ Add Your Photo"
2. Select an image (< 5MB)
3. Add caption: "Test photo"
4. Add name: "Test Contributor"
5. Click "Add to Story"
6. Verify photo appears in timeline

### 4. Test Share Functionality

1. Click "Copy Link" - verify clipboard copy
2. Click "WhatsApp" - verify opens WhatsApp web
3. Click "Telegram" - verify opens Telegram web

### 5. Mobile Testing

1. Open Chrome DevTools
2. Toggle device toolbar (Cmd+Shift+M)
3. Test on iPhone SE, iPhone 12 Pro, Pixel 5
4. Verify:
   - Responsive layout
   - Touch-friendly buttons
   - Image display
   - Modal behavior

### 6. Edge Cases

- Upload file > 5MB (should show error)
- Upload non-image file (should reject)
- Create story without album link (should work)
- View non-existent story ID (should show error)
- Empty timeline (should show placeholder)

## Production Testing

After deployment:

1. Test story creation on production URL
2. Share link with friend to test contributor flow
3. Test on real mobile devices (iOS Safari, Android Chrome)
4. Verify images load correctly
5. Test share buttons on mobile

## Performance Testing

1. Upload 10+ photos to a story
2. Verify lazy loading works
3. Check page load time (should be < 2s)
4. Test on slow 3G network

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Samsung Internet

## API Testing

Use curl or Postman:

```bash
# Create story
curl -X POST http://localhost:8080/api/stories \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","creator_name":"User","album_link":""}'

# Get story
curl http://localhost:8080/api/stories/STORY_ID

# Get photos
curl http://localhost:8080/api/photos?story_id=STORY_ID

# Upload photo
curl -X POST http://localhost:8080/api/upload \
  -F "photo=@test.jpg" \
  -F "story_id=STORY_ID" \
  -F "caption=Test" \
  -F "uploaded_by=User"
```
