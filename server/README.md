# monthexpense Server

Simple Node.js + SQLite server for storing expenses and incomes.

Quick start:

1. Install dependencies

```bash
cd server
npm install
```

2. Run server

```bash
npm run start
# or for development with auto-reload
npm run dev
```

The server listens on `http://localhost:4000` by default and exposes REST endpoints under `/api/expenses` and `/api/incomes`.

CORS is enabled to allow connections from the frontend (Vite).
