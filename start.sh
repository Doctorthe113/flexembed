#!/usr/bin/zsh
source ~/.zshrc

cd server
source .venv/bin/activate
uvicorn server:app --port 8000
