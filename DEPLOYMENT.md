# Deployment Guide

## Backend Deployment (Fly.io - Free Tier)

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login and launch:
```bash
cd backend
fly launch
fly deploy
```

3. Note your backend URL (e.g., `https://ourstory.fly.dev`)

## Frontend Deployment (Cloudflare Pages - Free)

1. Update `frontend/src/api.js`:
```javascript
const API_BASE = import.meta.env.PROD ? 'https://your-backend.fly.dev' : '';
```

2. Build:
```bash
cd frontend
npm run build
```

3. Deploy to Cloudflare Pages:
- Go to https://pages.cloudflare.com
- Connect your GitHub repo
- Build command: `cd frontend && npm install && npm run build`
- Build output: `frontend/dist`

## Alternative: Railway (Backend)

```bash
cd backend
railway login
railway init
railway up
```

## Alternative: Netlify (Frontend)

```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

## Environment Variables

Backend (if needed):
- `PORT` - Server port (default: 8080)

Frontend:
- Update API_BASE in `src/api.js` with your backend URL

## Database

SQLite database is created automatically on first run.
For production, consider upgrading to PostgreSQL on your hosting platform.
