# Setup Guide

[← README](../README.md) · [API Documentation](API_DOCUMENTATION.md) · [Project Overview](PROJECT_OVERVIEW.md)

## Prerequisites

- Python and `pip` for the backend (the repository does not pin a minimum Python version).
- Node.js and npm for the frontend.
- The checked-in backend model and scaler artifacts under `backend/models/` and `backend/scalers/`.

## Backend

From the project root, create and activate a virtual environment, install the listed dependencies, and start FastAPI:

### Windows PowerShell

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn main:app --reload
```

### macOS / Linux

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
uvicorn main:app --reload
```

The backend expects the CSV at `backend/powerplant_data.csv` and model/scaler files in the sibling `models/` and `scalers/` directories. OpenAPI documentation is served at `http://127.0.0.1:8000/docs`.

## Frontend

In a second terminal, from the project root:

```bash
cd Frontend
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. The frontend's API requests are currently hardcoded to `http://127.0.0.1:8000`, and backend CORS permits `http://localhost:5173`.

## Run both services

Keep both terminal processes running. Start the backend first so prediction, comparison, and evaluation requests can reach the API. The frontend dev server serves the React app; FastAPI serves predictions and dataset/model metrics.

For endpoint examples, see [API Documentation](API_DOCUMENTATION.md). For model files and evaluation behavior, see [Machine Learning](MACHINE_LEARNING.md) and [Model Evaluation](MODEL_EVALUATION.md).
