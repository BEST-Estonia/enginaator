# Enginaator Deployment Guide

## Render Deployment Configuration

This project uses Render for deployment with two services:
- **Backend API**: Docker-based Node.js/Express API with Prisma ORM
- **Frontend**: Next.js application with standalone output

## Prerequisites

1. GitHub repository connected to Render
2. PostgreSQL database (can use Render PostgreSQL or external like Supabase)
3. Cloudinary account for image storage

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

The `render.yaml` file at the root of the repository defines both services. Render will automatically create both services when you:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create both services

### Option 2: Manual Service Creation

#### Backend Deployment

1. **Create Web Service**
   - Service Type: `Web Service`
   - Name: `enginaator-backend`
   - Runtime: `Docker`
   - Region: `Frankfurt (EU Central)` or closest to your users
   - Branch: `main`
   - Root Directory: `backend`
   - Dockerfile Path: `./Dockerfile` (default)

2. **Configure Build**
   - Pre-Deploy Command: `npx prisma migrate deploy`

3. **Environment Variables** (Add these in Render dashboard):
   ```
   NODE_ENV=production
   PORT=8000
   DATABASE_URL=<your_postgresql_connection_string>
   SHADOW_DATABASE_URL=<optional_shadow_db_url>
   JWT_SECRET=<your_secret_key>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
   CLOUDINARY_API_KEY=<your_cloudinary_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_secret>
   DEFAULT_EDITION_CAPACITY=32
   EDITION_ROLLOVER_MONTH=9
   FRONTEND_URL=<your_frontend_url_after_deployment>
   ALLOWED_ORIGINS=<your_frontend_url_after_deployment>
   ```

4. **Database Setup** (if using Render PostgreSQL):
   - Create a new PostgreSQL database in Render
   - Copy the "Internal Database URL"
   - Use it as `DATABASE_URL` in backend environment variables

#### Frontend Deployment

1. **Create Web Service** (NOT Static Site)
   - Service Type: `Web Service`
   - Name: `enginaator-frontend`
   - Runtime: `Node`
   - Region: `Frankfurt (EU Central)` or same as backend
   - Branch: `main`
   - Root Directory: `frontend`

2. **Configure Build**
   - Build Command: `npm install; npm run build`
   - Start Command: `npm start`

3. **Environment Variables**:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=<your_backend_url>/api
   ```
   Example: `https://enginaator-backend.onrender.com/api`

## Post-Deployment Configuration

After both services are deployed:

1. **Update Backend Environment Variables**:
   - Set `FRONTEND_URL` to your frontend URL (e.g., `https://enginaator-frontend.onrender.com`)
   - Set `ALLOWED_ORIGINS` to the same frontend URL

2. **Update Frontend Environment Variables**:
   - Set `NEXT_PUBLIC_API_URL` to your backend URL + `/api` (e.g., `https://enginaator-backend.onrender.com/api`)

3. **Test the Deployment**:
   - Visit your frontend URL
   - Test the registration form (should connect to backend API)
   - Test admin login at `/admin/login`
   - Verify image uploads work (Cloudinary integration)

## Architecture

```
┌─────────────────┐
│  Frontend       │
│  (Next.js)      │ ← Users access this
│  Port: 10000    │
└────────┬────────┘
         │
         │ API calls to /api
         ↓
┌─────────────────┐
│  Backend API    │
│  (Express)      │
│  Port: 8000     │
└────────┬────────┘
         │
         ├─→ PostgreSQL Database
         └─→ Cloudinary (Images)
```

## Key Configuration Files

- `/backend/Dockerfile` - Backend containerization
- `/backend/prisma/schema.prisma` - Database schema
- `/frontend/next.config.ts` - Next.js configuration with `standalone` output
- `/render.yaml` - Render blueprint for automated deployment

## Notes

- **Free Tier Limitations**: Services may spin down after inactivity (15 min). First request after idle will be slow.
- **Database**: Keep your `DATABASE_URL` secure and never commit it to Git
- **Cloudinary**: Free tier has storage/bandwidth limits
- **Build Time**: Frontend builds take ~35-40 seconds, backend builds ~20-25 seconds

## Troubleshooting

### Backend won't build
- Check that `prisma/schema.prisma` exists before running `npm ci`
- Verify `DATABASE_URL` is set correctly
- Check Pre-Deploy Command runs successfully

### Frontend build fails
- Ensure `Root Directory` is set to `frontend`
- Verify `npm start` command works locally
- Check that `NEXT_PUBLIC_API_URL` is set

### API calls fail from frontend
- Verify `NEXT_PUBLIC_API_URL` includes `/api` at the end
- Check CORS settings in backend (`ALLOWED_ORIGINS`)
- Ensure backend service is running

### Admin pages don't work
- Admin routes require server-side rendering (Web Service, not Static Site)
- Check that `output: 'standalone'` is set in `next.config.ts`

## Support

For issues or questions:
- Check Render logs in the dashboard
- Review [Render Documentation](https://render.com/docs)
- Verify all environment variables are set correctly
