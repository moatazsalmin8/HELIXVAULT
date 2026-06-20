# HelixVault

Enterprise SaaS demo for DNA data storage: digital encoding, archive management, decay/retrieval simulation, provider marketplace, billing tiers, and Gemini-powered sequence optimization.

## Prerequisites

- Node.js 18+

## Run locally

```powershell
cd helixvault
npm install
```

Optional — enable live Gemini optimization reports:

```powershell
Copy-Item .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY to your key from https://aistudio.google.com/apikey
```

Start the dev server:

```powershell
npm run dev
```

Open **http://localhost:3000**

### Demo login (UI-only)

| Field | Value |
|-------|-------|
| Email | `moatazsalmin@gmail.com` |
| Password | `sequencer-pass-2026` |
| MFA code | `192026` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Express + Vite dev server on port 3000 |
| `npm run build` | Production build (client + server bundle) |
| `npm run start` | Run production server (`NODE_ENV=production`) |
| `npm run lint` | TypeScript type check |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run clean` | Remove build artifacts |

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/archives` | List DNA archives |
| POST | `/api/archives/encode` | Encode text to DNA |
| POST | `/api/archives/decode` | Simulate decay & retrieval |
| DELETE | `/api/archives/:id` | Delete archive |
| GET | `/api/logs` | Retrieval simulation audit logs |
| GET | `/api/providers` | Marketplace listings & ratings |
| POST | `/api/providers/listings` | Onboard a provider listing |
| POST | `/api/providers/rating` | Submit provider rating |
| GET | `/api/synthesis/jobs` | Synthesis job queue |
| POST | `/api/synthesis/dispatch` | Advance job status |
| GET | `/api/billing/invoices` | Billing invoices |
| POST | `/api/billing/subscribe` | Change subscription tier |
| GET | `/api/analytics/metrics` | SaaS investor metrics |
| POST | `/api/gemini/optimize` | Gemini sequence optimization report |

## Data persistence

Application state is persisted to `.helixvault-data/store.json` on disk. Data survives server restarts. Delete that folder to reset to seed data.

## Testing

```powershell
npm run test
npm run lint
npm run build
```

Quick API smoke test:

```powershell
Invoke-RestMethod http://localhost:3000/api/archives
Invoke-RestMethod http://localhost:3000/api/logs
```

## Project structure

```
helixvault/
├── server.ts           # Express API + Vite middleware
├── src/
│   ├── App.tsx         # React UI
│   ├── dnaEngine.ts    # DNA codec & provider adapters
│   ├── dbMock.ts       # Persisted in-memory store
│   └── types.ts        # Shared TypeScript types
├── .env.example        # Environment variable template
└── vitest.config.ts    # Test configuration
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No | Gemini API key for live optimization reports (falls back to procedural text) |
| `APP_URL` | No | Hosted app URL (used in AI Studio deployments) |
| `NODE_ENV` | No | Set to `production` for production static serving |
