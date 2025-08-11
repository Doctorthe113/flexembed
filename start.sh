#!/usr/bin/zsh

set -e

source ~/.zshrc

cd ./server
source .venv/bin/activate
uvicorn server:app --port 8000
