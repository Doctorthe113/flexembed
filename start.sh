#!/usr/bin/zsh

set -e

cd /root/projects/flexembed/server
source .venv/bin/activate
uvicorn server:app --port 8000
