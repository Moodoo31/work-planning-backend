# Work Planning Backend

Backend API for work planning application - Tramway conductors

## Features

- Employee management
- Service scheduling
- Planning requests (recovery, leave, shift exchange)
- Notifications (email + push)
- Radar/timesheet tracking

## Installation

```bash
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

## Running

```bash
npm run dev
```

## API Routes

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/employees` - List employees
- `GET /api/services` - List services
- `POST /api/requests` - Create planning request
- `GET /api/planning/employee/:id` - Get employee planning
