#!/bin/bash
set -e

# Configuration — set these as environment variables before running, or edit the defaults below
IMAGE="${IMAGE:-yourdockerhubuser/ourstory:latest}"
CONTAINER_NAME="${CONTAINER_NAME:-ourstory}"
PORT="${PORT:-8080}"
DATA_DIR="${DATA_DIR:-$(pwd)/data}"

# Pull latest image
echo "Pulling $IMAGE..."
docker pull "$IMAGE"

# Stop and remove existing container if running
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Stopping existing container..."
  docker stop "$CONTAINER_NAME"
  docker rm "$CONTAINER_NAME"
fi

# Create data directories for SQLite and uploads persistence
mkdir -p "$DATA_DIR"

# Run the container
echo "Starting container on port $PORT..."
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "$PORT":8080 \
  -v "$DATA_DIR":/root \
  -e PORT=8080 \
  "$IMAGE"

echo "✅ Running at http://localhost:$PORT"
