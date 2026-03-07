# OurStory

A mobile-first web app for creating shared photo story timelines.

## 🚀 Quick Start

```bash
# Start both backend and frontend
./dev.sh
```

Or manually:

```bash
# Terminal 1: Backend
cd backend
go run main.go

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## ✨ Features

- Create story in < 30 seconds
- Upload photos in < 10 seconds
- Mobile-first responsive design
- Share via WhatsApp, Telegram, link
- Beautiful timeline view
- Zero-config SQLite database
- Free to deploy and run

## 🛠 Tech Stack

**Frontend**: React + Vite + TailwindCSS  
**Backend**: Go + SQLite  
**Deploy**: Fly.io + Cloudflare Pages (free tier)

## 📦 Production Build

### Backend
```bash
cd backend
go build -o ourstory
./ourstory
```

### Frontend
```bash
cd frontend
npm run build
```

## 🌐 Deploy

**Backend** (Fly.io):
```bash
cd backend
fly launch
fly deploy
```

**Frontend** (Cloudflare Pages):
- Connect GitHub repo
- Build: `cd frontend && npm install && npm run build`
- Output: `frontend/dist`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

- [API.md](API.md) - API endpoints
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy guide
- [TESTING.md](TESTING.md) - Testing guide
- [FEATURES.md](FEATURES.md) - Feature checklist

## 📝 License

MIT
