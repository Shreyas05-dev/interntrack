# InternTrack 🎯

**A full-stack internship application tracker built to simplify the internship hunt.**

InternTrack helps students organize internship applications, track recruitment progress, and manage opportunities from one dashboard.

## Features

- **Dashboard** — Get an overview of your internship search.
-**Application tracking** — Store company names, roles, and application statuses.
-**Status management** — Track applications through Saved, Applied, Assessment, Interview, Offer, and Rejected.
-**Search** — Find applications quickly.
-**Persistent storage** — Store application data in PostgreSQL.
-**REST API** — Manage applications through a FastAPI backend.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Version Control | Git and GitHub |

## Project Structure

```text
interntrack/
├── frontend/       # React + TypeScript application
├── backend/        # FastAPI backend
│   └── main.py
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Shreyas05-dev/interntrack.git
cd interntrack
```

### 2. Start the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install fastapi "uvicorn[standard]" sqlalchemy "psycopg[binary]"
```

Make sure PostgreSQL is running and a database named `interntrack` exists.

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

API documentation: http://127.0.0.1:8000/docs

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173/.

## 🗺️ Roadmap

- [x] React dashboard
- [x] FastAPI application endpoints
- [x] PostgreSQL integration
- [ ] Interview scheduling and deadlines
- [ ] Advanced search and filters
- [ ] Analytics and visual reports
- [ ] User authentication
- [ ] Public deployment

## Contributing

Suggestions and improvements are welcome. Feel free to open an issue or submit a pull request.

## License

A license has not been selected yet.
