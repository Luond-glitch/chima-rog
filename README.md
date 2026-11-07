# CHIMA – Chipukizi wa Mazingira · Website

React + Tailwind + Framer Motion frontend · Flask REST API · SQLite/PostgreSQL · Supabase file storage.

```
chima-website/
├── frontend/   React (Vite) app – public site + /admin dashboard
└── backend/    Flask API, database models, auth, Supabase upload
```

## 1. Run it locally

**Backend** (terminal 1)
```bash
cd backend
python3 -m venv venv && source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # (already present) – edit values, see below
python wsgi.py                # http://127.0.0.1:5000  – creates DB + sample content on first run
```

**Frontend** (terminal 2)
```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173  (proxies /api to Flask)
```

**Admin dashboard:** http://localhost:5173/admin
Default login → `admin@chima.or.ke` / `ChangeMe!2026`  (set in `backend/.env`; change it under *Admin → Password*).

## 2. WHERE TO ADD YOUR SUPABASE TOKEN  ← important

Open **`backend/.env`** and replace the three fake values:

```env
SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co     # Supabase → Project Settings → API → Project URL
SUPABASE_SERVICE_KEY=fake-supabase-service-role-key-REPLACE-ME   # same page → service_role secret
SUPABASE_BUCKET=chima-media                           # Storage → New bucket (tick "Public bucket")
```

* The **service_role** key stays on the server only – never put it in the frontend or commit `.env`.
* Until real keys are set, uploads are saved to `backend/uploads/` so the admin panel still works. The admin Dashboard shows *“Connected to Supabase ✔”* once the keys are valid.
* Upload logic lives in `backend/chima/storage.py`.

## 3. What the admin can manage (`/admin`)
Projects · Stories & News (drafts supported) · Activities · Programs · Impact statistics · Partners ·
**Leadership (add every executive member: name, role, bio, photo, email, LinkedIn)** · Media & files ·
Contact/volunteer/partner submissions · Organisation info (contact, socials, mission, vision, history, values) · Password.

Executive members appear automatically on **About → Leadership & governance**.

## 4. Sample content to replace before launch
All numbers, partners, projects, stories and leader names are **mock data** (clearly marked “Sample”). Replace them in the admin.
Images that aren't uploaded yet show built-in ASAL landscape illustrations (`frontend/src/components/Scene.jsx`), so nothing looks broken. Contact email/phone/address in *Organisation info* are placeholders too.

## 5. Brand
Logo: `frontend/public/chima-logo.jpeg` (replace the file to update). Palette (see `tailwind.config.js`): forest/leaf green, olive, sun gold, terracotta, earth brown, sand & cream – sampled from the logo.

## 6. Tests
```bash
cd backend && pytest -q        # 8 API tests (auth, CRUD, validation, uploads…)
cd frontend && npm run build   # production build
```

## 7. Deployment
**Backend** (Render / Railway / Fly / any VPS)
1. Set env vars from `.env.example` on the host; use a strong `SECRET_KEY`, `FLASK_ENV=production`.
2. Use PostgreSQL: `DATABASE_URL=postgresql+psycopg2://…` (`pip install psycopg2-binary`).
3. Set `CORS_ORIGINS=https://your-site.com`.
4. Start command: `gunicorn wsgi:app --bind 0.0.0.0:$PORT`

**Frontend** (Netlify / Vercel / Cloudflare Pages)
1. Set `VITE_API_URL=https://your-api-domain` · build `npm run build` · publish `dist/`.
2. Add an SPA fallback so all routes serve `index.html` (Netlify: `/* /index.html 200`).

**Before going live:** change admin password, set real `SECRET_KEY`, replace sample data, add real Supabase keys, serve over HTTPS.

## 8. Security notes
JWT admin auth (12h), hashed passwords, login & form rate limits, honeypot spam field, server-side validation, upload type/size allow-list, security headers, secrets only in `.env`. For multi-server production consider Flask-Limiter + Redis for rate limiting.

## 9. Extending
New content type → add a model in `backend/chima/models.py` (+ `RESOURCES`), a form in `frontend/src/admin/config.js`, and a page. Public + admin CRUD endpoints are generated automatically.
