# Mini Tasks (2 capas)

App pequeña con backend en **Node.js/Express** y frontend en **HTML + VanillaJS**. El frontend consume el backend usando `API_BASE_URL`.

## Estructura
- `backend/`: API REST (tareas en memoria).
- `frontend/`: UI estática que consume la API.

## Requisitos
- Node.js 18+

## Variables de ambiente
### Backend
Archivo: `backend/.env` (usa `backend/.env.example` como base)
```
HOST=0.0.0.0
PORT=4000
CORS_ORIGIN=https://tu-usuario.github.io
```

### Frontend
Archivo: `frontend/.env` (usa `frontend/.env.example` como base)
```
API_BASE_URL=https://tu-backend.onrender.com
```

Luego genera `frontend/config.js`:
```
cd frontend
npm run build-config
```

## Ejecutar en local
### Backend
```
cd backend
npm install
npm start
```
API en: `http://localhost:4000`

### Frontend
1. Configura `frontend/.env` con `API_BASE_URL=http://localhost:4000`
2. Genera `config.js`:
```
cd frontend
npm run build-config
```
3. Abre `frontend/index.html` en el navegador.

## Despliegue en Render (backend)
1. Render → **New Web Service** → conecta el repo.
2. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Environment:**
   - `HOST=0.0.0.0`
   - `CORS_ORIGIN=https://tu-usuario.github.io`
   - `PORT` no se define (Render lo inyecta).
4. Despliega y copia el URL público del servicio.

## Despliegue en GitHub Pages (frontend)
1. En GitHub: **Settings → Pages**.
2. **Source:** Deploy from a branch.
3. **Branch:** `main` (o tu rama) y **Folder:** `/frontend`.
4. Antes de publicar, genera `config.js` apuntando al backend en Render:
```
cd frontend
echo API_BASE_URL=https://tu-backend.onrender.com > .env
npm run build-config
```

## Endpoints principales
- `GET /api/tasks`
- `POST /api/tasks` `{ "title": "...", "description": "..." }`
- `DELETE /api/tasks/:id`
