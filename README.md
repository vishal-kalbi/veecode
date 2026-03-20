# VeeCode — Coding Challenge Platform

A full-stack coding challenge platform where users solve problems in 11+ programming languages with an integrated Monaco code editor and real-time code execution.

## Screenshots

### Home Page
![Home Page](screenshots/01-home.png)

### Challenge List
![Challenges](screenshots/04-challenges.png)

### Code Editor with Problem Description
![Editor](screenshots/05-editor.png)

### Profile — Stats, Activity Heatmap, Badges & Languages
![Profile](screenshots/07-profile.png)

### Leaderboard
![Leaderboard](screenshots/06-leaderboard.png)

### Admin Dashboard
![Admin](screenshots/08-admin.png)

### Admin — Manage Challenges
![Admin Challenges](screenshots/09-admin-challenges.png)

### Authentication
| Login | Sign Up |
|-------|---------|
| ![Login](screenshots/03-login.png) | ![Signup](screenshots/02-signup.png) |

## Tech Stack

**Frontend:** React 19, Vite 8, Tailwind CSS 4, Monaco Editor, React Router v7

**Backend:** Node.js, Express 5, PostgreSQL, JWT Authentication

**Code Execution:** Piston (self-hosted via Docker)

## Features

### Core
- Browse and filter 15+ coding challenges by difficulty and topic
- Integrated Monaco code editor with syntax highlighting for 11 languages
- Run code against sample test cases or submit against all test cases
- Real-time code execution with expandable results and diff highlighting
- User authentication (signup/login) with JWT

### Gamification & Leaderboard
- Points system: Easy (1pt), Medium (3pt), Hard (5pt) per first-solve
- Daily streak tracking with current and max streak
- 7 achievement badges (First Blood, Polyglot, Week Warrior, etc.)
- Global leaderboard with rank, score, solved count, and streak

### Enhanced Challenge Experience
- Code auto-saves to localStorage per challenge and language
- Keyboard shortcuts: `Ctrl+Enter` to run, `Ctrl+Shift+Enter` to submit
- Language switch confirmation to prevent accidental code loss
- Built-in challenge timer with pause/resume
- Custom test input — run code with your own input
- Hints system with progressive reveal
- Community solutions (unlocked after solving)
- Submission history with "Load" to restore past code

### Profile & Stats
- Solve stats by difficulty
- GitHub-style activity heatmap (365 days)
- Language breakdown pie chart
- Badge showcase
- Streak display

### Admin Panel (`/admin`)
- Dashboard with user/challenge/submission counts
- CRUD for challenges and test cases
- User role management (user/admin)

### Social
- Discussion comments on each challenge (threaded replies)
- Share solutions via unique link
- Shared solution viewer page

### UI Polish
- Skeleton loaders, page transitions, responsive mobile layout
- 404 page, confirm dialogs, toast notifications

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

# Run schema, seed data, and migrations
psql -U postgres -d veecode -f server/db/schema.sql
psql -U postgres -d veecode -f server/db/seed.sql
psql -U postgres -d veecode -f server/db/migrations/001_gamification.sql
psql -U postgres -d veecode -f server/db/migrations/002_hints.sql
psql -U postgres -d veecode -f server/db/migrations/003_admin.sql
psql -U postgres -d veecode -f server/db/migrations/004_social.sql
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
│   ├── db/                   # SQL schema, seeds, migrations
│   ├── scripts/              # DB seed script
│   └── src/
│       ├── config/           # Database connection
│       ├── controllers/      # Route handlers
│       ├── middleware/        # Auth, admin, error handling
│       ├── routes/           # API route definitions
│       └── services/         # Piston execution, badge service
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
| POST | `/api/submissions/run-custom` | Yes | Run code with custom input |
| GET | `/api/submissions/community/:slug` | Yes | Community solutions |
| GET | `/api/users/profile` | Yes | Get user stats + badges + activity |
| GET | `/api/users/progress` | Yes | Get solved challenge slugs |
| GET | `/api/users/submissions` | Yes | Get submission history |
| GET | `/api/leaderboard` | No | Global leaderboard |
| GET | `/api/leaderboard/me` | Yes | Your rank |
| GET | `/api/hints/:slug` | Yes | Get hints for a challenge |
| POST | `/api/hints/:id/reveal` | Yes | Reveal a hint |
| GET | `/api/comments/:slug` | No | Get discussion comments |
| POST | `/api/comments/:slug` | Yes | Post a comment |
| POST | `/api/share` | Yes | Share a submission |
| GET | `/api/share/:token` | No | View shared solution |
| GET | `/api/admin/dashboard` | Admin | Admin dashboard stats |
| GET | `/api/admin/challenges` | Admin | Manage challenges |
| POST | `/api/admin/challenges` | Admin | Create challenge |
| PUT | `/api/admin/challenges/:id` | Admin | Update challenge |
| DELETE | `/api/admin/challenges/:id` | Admin | Delete challenge |
| GET | `/api/admin/users` | Admin | List all users |
| PUT | `/api/admin/users/:id/role` | Admin | Change user role |
