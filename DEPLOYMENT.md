# 🚀 MongoDB Deployment Guide

## Pre-deployment Checklist

### 1. Environment Variables Setup
- [ ] MONGODB_URI (MongoDB connection string)
- [ ] JWT_SECRET (for authentication tokens)

### 2. Database Setup
- [ ] MongoDB Atlas cluster created OR local MongoDB running
- [ ] Database initialized with sample data
- [ ] Test database connection

### 3. Code Preparation
- [ ] Build passes locally: `npm run build`
- [ ] No TypeScript errors
- [ ] All environment variables configured

## Deployment Steps

### Step 1: Set Up MongoDB Database

**Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Whitelist your deployment IP (or use 0.0.0.0/0 for development)

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. Use connection string: `mongodb://localhost:27017/voting-platform`

### Step 2: Prepare Your Repository
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy!

### Step 4: Post-deployment
1. Run database initialization: Visit `/admin` and click "Initialize MongoDB Database"
2. Test admin login
3. Test student voting flow

## Environment Variables for Vercel

Add these in your Vercel dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voting-platform
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Production URLs
- Admin: https://your-app.vercel.app/admin
- Student: https://your-app.vercel.app/dashboard
- Login: https://your-app.vercel.app/

## Troubleshooting
- Check Vercel function logs for errors
- Verify environment variables are set
- Test database connection in production
- Ensure MongoDB Atlas IP whitelist includes Vercel's IPs

## Security Notes
- Change JWT_SECRET in production
- Use strong MongoDB credentials
- Enable MongoDB Atlas IP whitelisting
- Monitor database access logs