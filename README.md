# VeeCode — Coding Challenge Platform

A full-stack coding challenge platform where users solve problems in 11+ programming languages with an integrated Monaco code editor and real-time code execution.

## Tech Stack

**Frontend:** React 19, Vite 8, Tailwind CSS 4, Monaco Editor, React Router v7

**Backend:** Node.js, Express 5, PostgreSQL, JWT Authentication

**Code Execution:** Piston (self-hosted via Docker)

## Features

- Browse and filter 15+ coding challenges by difficulty and topic
- Integrated Monaco code editor with syntax highlighting for 11 languages
- Run code against sample test cases or submit against all test cases
- Real-time code execution with expandable results and diff highlighting
- User authentication (signup/login) with JWT
- Profile page with solve stats by difficulty
- Code auto-saves to localStorage per challenge and language
- Keyboard shortcuts: `Ctrl+Enter` to run, `Ctrl+Shift+Enter` to submit
- Language switch confirmation to prevent accidental code loss
- Skeleton loaders, page transitions, and responsive mobile layout

## Supported Languages

Python, JavaScript, TypeScript, C, C++, Java, Go, Rust, Ruby, Kotlin

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker (for Piston code execution engine)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/vishal-kalbi/veecode.git
cd veecode
```

### 2. Set up the database

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE veecode;"

# Run schema and seed data
psql -U postgres -d veecode -f server/db/schema.sql
psql -U postgres -d veecode -f server/db/seed.sql
```

### 3. Configure environment variables

**Server** (`server/.env`):

```
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/veecode
JWT_SECRET=your_secret_key
JUDGE0_API_URL=http://localhost:2358
JUDGE0_API_KEY=
```

**Client** (`client/.env`):

```
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the code execution engine

```bash
cd judge0
docker compose up -d
```

Install language runtimes inside Piston:

```bash
curl -X POST http://localhost:2358/api/v2/packages -H 'Content-Type: application/json' -d '{"language":"python","version":"3.10.0"}'
curl -X POST http://localhost:2358/api/v2/packages -H 'Content-Type: application/json' -d '{"language":"node","version":"18.15.0"}'
curl -X POST http://localhost:2358/api/v2/packages -H 'Content-Type: application/json' -d '{"language":"gcc","version":"10.2.0"}'
curl -X POST http://localhost:2358/api/v2/packages -H 'Content-Type: application/json' -d '{"language":"java","version":"15.0.2"}'
curl -X POST http://localhost:2358/api/v2/packages -H 'Content-Type: application/json' -d '{"language":"go","version":"1.16.2"}'
curl -X POST http://localhost:2358/api/v2/packages -H 'Content-Type: application/json' -d '{"language":"rust","version":"1.68.2"}'
curl -X POST http://localhost:2358/api/v2/packages -H 'Content-Type: application/json' -d '{"language":"typescript","version":"5.0.3"}'
curl -X POST http://localhost:2358/api/v2/packages -H 'Content-Type: application/json' -d '{"language":"ruby","version":"3.0.1"}'
curl -X POST http://localhost:2358/api/v2/packages -H 'Content-Type: application/json' -d '{"language":"kotlin","version":"1.8.20"}'
```

### 5. Install dependencies and start

```bash
# Server
cd server
npm install
npm run dev

# Client (in a new terminal)
cd client
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

## Project Structure

```
veecode/
├── client/                   # React frontend
│   └── src/
│       ├── api/              # Axios instance
│       ├── components/       # Reusable UI components
│       ├── context/          # Auth context
│       ├── hooks/            # Custom hooks
│       ├── pages/            # Route pages
│       └── utils/            # Constants and helpers
├── server/                   # Express backend
│   ├── db/                   # SQL schema and seed data
│   ├── scripts/              # DB seed script
│   └── src/
│       ├── config/           # Database connection
│       ├── controllers/      # Route handlers
│       ├── middleware/        # Auth and error handling
│       ├── routes/           # API route definitions
│       └── services/         # Piston code execution
└── judge0/                   # Docker Compose for Piston
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/signup` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and get JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/challenges` | No | List challenges (filterable) |
| GET | `/api/challenges/:slug` | No | Get challenge details |
| POST | `/api/submissions/run` | Yes | Run code on sample tests |
| POST | `/api/submissions/submit` | Yes | Submit code on all tests |
| GET | `/api/users/profile` | Yes | Get user stats |
| GET | `/api/users/progress` | Yes | Get solved challenge slugs |
| GET | `/api/users/submissions` | Yes | Get submission history |
