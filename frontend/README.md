# Lazarus — Digital Forensics & File Recovery Platform

A web-based digital forensics platform for file carving and evidence management, built as a bachelor's thesis project at Babeș-Bolyai University, FSEGA.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Python, FastAPI, Motor
- **Database:** MongoDB Atlas

## Running the project

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # fill in your credentials
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Author

Varvara Dorin-Robert — Babeș-Bolyai University, 2026