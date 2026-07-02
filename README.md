# Lazarus - Digital Forensics & File Recovery Platform

A web-based digital forensics platform for recovering deleted files from disk images using file carving techniques. Built as a bachelor's thesis project at Babeș-Bolyai University, FSEGA (2026).

## Features

- **File Carving Engine** — recovers JPEG, PNG, PDF, and DOCX files from raw disk images by identifying binary signatures (magic bytes), independent of the file system
- **Integrity Verification** — calculates MD5 and SHA256 hashes for every recovered file, supporting chain of custody in forensic investigations
- **Hex Viewer** — visualizes the raw binary content of recovered files in hexadecimal format, with offset and ASCII columns
- **Evidence Vault** — organizes forensic investigations into cases with status tracking and investigator assignment
- **Reports & PDF Export** — generates investigation summaries with file type statistics, exportable as PDF directly from the browser
- **Audit Log** — automatically records all user actions (login, scan start, case creation) for accountability
- **Notifications** — real-time alerts when a scan completes, delivered via in-app notification panel
- **Authentication** — local login with bcrypt-hashed passwords + Google OAuth2 integration
- **Forgot Password** — token-based password reset flow with 15-minute expiry
- **Session Security** — automatic session timeout after 10 minutes of inactivity, with a 60-second warning modal
- **Dark / Light Mode** — user-selectable visual theme, persisted in the database
- **Multilingual UI** — interface available in English, German, and French

## Tech Stack

**Frontend**
- React 18, Vite, Tailwind CSS
- React Router, Axios, jsPDF
- Google Fonts (Space Grotesk, JetBrains Mono), Material Symbols

**Backend**
- Python 3.12, FastAPI, Uvicorn
- Motor (async MongoDB driver)
- python-jose (JWT), passlib + bcrypt, httpx
- pydantic-settings, python-dotenv

**Database**
- MongoDB Atlas (NoSQL, document-oriented, cloud-hosted)

## Architecture

The application follows a client-server architecture with a clear separation between frontend and backend.

The frontend communicates with the backend exclusively through a REST API over HTTP, with data exchanged in JSON format. Authentication is handled via JWT tokens, attached automatically to every request through an Axios interceptor.

The file carving engine runs as a FastAPI background task, allowing the server to return an immediate response while processing continues asynchronously. The frontend polls the results endpoint every 2 seconds until the scan completes.

**Request flow:** Browser (React/Vite) → FastAPI Backend → MongoDB Atlas

**External services:** Google OAuth2 API (authentication)

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- MongoDB Atlas account
- Google Cloud Console project with OAuth2 credentials

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi "uvicorn[standard]" motor "python-jose[cryptography]" "passlib[bcrypt]" bcrypt==4.0.1 python-multipart pydantic-settings httpx python-dotenv email-validator
cp .env.example .env  # fill in your credentials
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

See `backend/.env.example` for the full list. Required variables:

- MONGO_URL=mongodb+srv://...
- DB_NAME=your_database_name
- SECRET_KEY=your_secret_key
- GOOGLE_CLIENT_ID=...
- GOOGLE_CLIENT_SECRET=...
- GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
-FRONTEND_URL=http://localhost:5173

## Known Limitations

- File carving supports JPEG, PNG, PDF, and DOCX only — audio, video, and archive formats are not yet supported
- Password reset emails are simulated via a UI modal (no real SMTP integration)
- Recovered files are stored temporarily on the backend server with no automatic cleanup policy
- The `/upload/disk-image` endpoint (multipart upload) is non-functional in the current version; use `/upload/by-path` instead
- The `/results` endpoint does not filter by `user_id`, which is a known access control limitation

## Author

**Varvara Dorin-Robert**
Bachelor's Thesis — Babeș-Bolyai University, FSEGA, Informatics and Economic Informatics, 2026
Coordinator: Chis Gheorghe Sebastian

[GitHub](https://github.com/VarvaraRobert) · [LinkedIn](https://www.linkedin.com/in/dorin-robert-varvara/)
