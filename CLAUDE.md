# CLAUDE.md

## Build / test / lint
No root manifest — commands are per-subproject.

Bloom Filter backend (`Bloom Filter/backend/package.json`):
- `npm start` → `node src/index.js`
- `npm run dev` → `node --watch src/index.js`
- `npm test` → `node --test tests/`

Bloom Filter frontend (`Bloom Filter/frontend/package.json`):
- `npm run dev` → `vite`
- `npm run build` → `vite build`
- `npm run preview` → `vite preview`

Chat Application (`Web Socket/Chat Application/package.json`):
- `npm start` → `node app.js`
- `npm run dev` → `nodemon app.js`

No lint script found in any package.json.

## Rules
- Each subproject has its own `package-lock.json` (npm) — no root lockfile, no evidence of pnpm/yarn.
- `Bloom Filter/` is normally run via `docker-compose.yml` (frontend on 3000, backend on 5001->5000, postgres on 5432) — see `Bloom Filter/README.md`.
- `CircuitBreaker/` is an empty directory — nothing to build there yet.

## Read first
- `Bloom Filter/backend/src/index.js` — backend server wiring (middleware, routes, error handling)
- `Bloom Filter/frontend/src/App.jsx` — frontend state/handler pattern used by all API calls
- `Web Socket/Chat Application/app.js` — chat server (Socket.IO event wiring)

Architecture: see ARCHITECTURE.md — read before structural changes
