#!/bin/bash
source .venv/bin/activate
uvicorn server:app --port 8000 --reload
