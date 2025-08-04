# 🚀 Deployment Checklist

Before deploying your Todo AI app, make sure you have:

## Backend Requirements
- [ ] Backend API is deployed and accessible
- [ ] Backend URL is using HTTPS (not HTTP)
- [ ] CORS is configured to allow your frontend domain
- [ ] All API endpoints are working:
  - [ ] `/api/auth/login`
  - [ ] `/api/auth/register` 
  - [ ] `/api/todos` (GET, POST)
  - [ ] `/api/todos/{id}` (PUT, DELETE)
  - [ ] `/api/todos/{id}/toggle`
  - [ ] `/api/health`

## Frontend Deployment
- [ ] Code is pushed to GitHub
- [ ] Environment variable `VITE_API_BASE_URL` is set in Vercel
- [ ] Production build works locally (`npm run build && npm run preview`)

## After Deployment
- [ ] Test user registration
- [ ] Test user login
- [ ] Test creating todos
- [ ] Test completing/uncompleting todos
- [ ] Test deleting todos
- [ ] Check browser console for errors

## Quick Commands

```bash
# Test production build locally
npm run build
npm run preview

# Push to GitHub
git add .
git commit -m "Ready for production"
git push origin main
```

## Your Backend URL
Set this in Vercel environment variables:
```
VITE_API_BASE_URL=https://todoai-ruqd.onrender.com/api
```
