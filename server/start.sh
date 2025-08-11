#!/usr/bin/zsh
source ~/.zshrc

source .venv/bin/activate
uvicorn server:app --port 8000
