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
**Deploy**: Docker Hub + GitHub Pages

## 📦 Production Build

### Backend
```bash
cd backend
./build.sh
```

> On macOS (Apple Silicon), `build.sh` automatically re-signs the binary after build. Use this instead of `go build` directly.

### Frontend
```bash
cd frontend
npm run build
```

## 🌐 Deploy

### CI/CD (GitHub Actions — branch: `release/v1`)

**Backend** — on push to `backend/**`:
- Builds and pushes Docker image to Docker Hub
- Tags with `latest` and commit SHA

**Frontend** — on push to `frontend/**`:
- Builds and deploys to GitHub Pages

#### Required GitHub Secrets
| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |

#### Required GitHub Variables
| Variable | Description |
|---|---|
| `DOCKER_IMAGE_NAME` | Full image name e.g. `youruser/ourstory` |
| `VITE_API_BASE` | Backend URL e.g. `http://your-server-ip:8080` |

### Server Deployment

Copy `deploy.sh` to your Linux server and run:

```bash
IMAGE="youruser/ourstory:latest" ./deploy.sh
```

Optional env vars:
| Variable | Default | Description |
|---|---|---|
| `IMAGE` | required | Docker image to pull and run |
| `CONTAINER_NAME` | `ourstory` | Container name |
| `PORT` | `8080` | Host port to expose |
| `DATA_DIR` | `./data` | Host directory for DB and uploads persistence |

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

- [API.md](API.md) - API endpoints
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy guide
- [TESTING.md](TESTING.md) - Testing guide
- [FEATURES.md](FEATURES.md) - Feature checklist

## 📝 License

MIT
