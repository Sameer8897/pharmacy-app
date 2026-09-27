# MediCart — Online Pharmacy (portfolio / learning MVP)

Java Spring Boot + React pharmacy storefront: browse medicines, JWT auth, cart, and test-mode checkout.

> **Not for real medicine sales.** Selling medicines in India needs a valid drug license. This is a demo project with dummy payments.

## Stack

| Layer | Choice |
|-------|--------|
| Backend | Spring Boot 2.7 (Java 11), Spring Security + JWT, Spring Data JPA |
| Frontend | React + Vite |
| DB (local) | H2 in-memory (`local` profile, default) |
| DB (deploy) | Postgres via Neon / Supabase / Docker |
| Payments | Dummy test payment id (swap in Razorpay later) |

## Project layout

```
pharmacy-app/
├── backend/          # Spring Boot REST API
├── frontend/         # React SPA
├── docs/schema.sql   # Postgres schema
├── docker-compose.yml
└── README.md
```

## Quick start (local)

### 1. Backend (H2 — no Postgres needed)

```bash
cd backend
./mvnw spring-boot:run
```

API: http://localhost:8080  
H2 console: http://localhost:8080/h2-console (JDBC URL `jdbc:h2:mem:pharmacy`)

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

Vite proxies `/api` → `http://localhost:8080`.

### Demo accounts (seeded)

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@pharmacy.com | customer123 |
| Admin | admin@pharmacy.com | admin123 |

Admin can `POST/PUT/DELETE /api/medicines` with a Bearer token.

## Optional: local Postgres

```bash
docker compose up -d
cd backend
SPRING_PROFILES_ACTIVE=postgres ./mvnw spring-boot:run
```

Defaults: `jdbc:postgresql://localhost:5432/pharmacy` / user `pharmacy` / password `pharmacy`.

## API overview

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/medicines?search=&category=` | Public |
| GET | `/api/medicines/{id}` | Public |
| POST/PUT/DELETE | `/api/medicines` | ADMIN |
| GET/POST/PUT/DELETE | `/api/cart…` | Customer |
| POST | `/api/orders/checkout` | Customer |
| GET | `/api/orders` | Customer |

## Deploy later

1. **DB** — Neon or Supabase Postgres; set `DATABASE_URL`, `DATABASE_USER`, `DATABASE_PASSWORD`, `SPRING_PROFILES_ACTIVE=postgres`
2. **Backend** — Render free web service (or Oracle Always Free VM); set `JWT_SECRET`, `CORS_ORIGINS`
3. **Frontend** — Vercel/Netlify; set `VITE_API_URL` to your Render API URL
4. **Images** — Cloudinary free tier for medicine photos
5. **Payments** — Razorpay test mode when ready

## License

MIT — for learning / portfolio use.
