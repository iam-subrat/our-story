#!/bin/bash
set -e

go build -o ourstory .

if [ "$(uname)" = "Darwin" ]; then
  codesign --force --sign - ourstory
fi

echo "Build complete: ./ourstory"
