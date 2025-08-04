# Deployment Guide - Todo AI App

## Quick Deployment: GitHub → Vercel

### Step 1: Push to GitHub

1. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Todo AI App"
   ```

2. **Create GitHub repository and push:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/todo-ai-ui.git
   git push -u origin main
   ```

### Step 2: Deploy with Vercel

1. **Go to [vercel.com](https://vercel.com) and sign in with GitHub**

2. **Import your repository:**
   - Click "New Project"
   - Select your `todo-ai-ui` repository
   - Click "Import"

3. **Configure Environment Variables:**
   - In the deployment setup, scroll down to "Environment Variables"
   - Add: `VITE_API_BASE_URL` = `https://todoai-ruqd.onrender.com/api`
   - Click "Deploy"

4. **Done!** Vercel will automatically:
   - Build your app (`npm run build`)
   - Deploy to a `.vercel.app` domain
   - Set up automatic deployments for future pushes

## Environment Variables Setup

### Required Environment Variables

- `VITE_API_BASE_URL`: The base URL of your backend API

### For Local Development
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

### For Production Deployment
```bash
VITE_API_BASE_URL=https://todoai-ruqd.onrender.com/api
```

## Alternative: Vercel CLI (Optional)

If you prefer command line:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login and deploy:**
   ```bash
   vercel login
   vercel
   # Follow the prompts, it will detect your GitHub repo
   ```

3. **Set environment variable:**
   ```bash
   vercel env add VITE_API_BASE_URL production
   # Enter your production API URL when prompted
   ```

## Pre-Deployment Checklist

- [ ] Backend API is deployed and accessible
- [ ] CORS is configured on backend for your frontend domain
- [ ] Environment variable `VITE_API_BASE_URL` is set correctly
- [ ] SSL certificate is configured (HTTPS)
- [ ] API health endpoints (`/health` and `/actuator/health`) are accessible
- [ ] Authentication endpoints are working
- [ ] Test the application with production API

## Build Commands

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

## Environment-Specific Features

- **Development**: API status indicator, detailed console logging
- **Production**: Minimal logging, no API status indicator, optimized build

## Troubleshooting

1. **CORS Issues**: Ensure backend allows requests from your frontend domain
2. **API Connection**: Check if `VITE_API_BASE_URL` is correct
3. **Build Issues**: Clear `node_modules` and reinstall dependencies
4. **Environment Variables**: Verify they're set correctly in your deployment platform

## Security Notes

- Never commit `.env` files with production secrets
- Use HTTPS for production deployments
- Ensure API endpoints use proper authentication
- Backend should validate JWT tokens properly
