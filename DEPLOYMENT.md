# 🚀 Vercel Deployment Guide

## Pre-deployment Checklist

### 1. Environment Variables Setup
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY  
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (optional)
- [ ] NEXT_PUBLIC_CLOUDINARY_API_KEY (optional)
- [ ] CLOUDINARY_API_SECRET (optional)

### 2. Database Setup
- [ ] Run SQL scripts in Supabase
- [ ] Initialize sample data
- [ ] Test database connection

### 3. Code Preparation
- [ ] Build passes locally: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] All environment variables configured

## Deployment Steps

### Step 1: Prepare Your Repository
\`\`\`bash
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy!

### Step 3: Post-deployment
1. Run database initialization on production
2. Test admin login
3. Test student voting flow
4. Verify image uploads work

## Environment Variables for Vercel

Add these in your Vercel dashboard:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

## Production URLs
- Admin: https://your-app.vercel.app/admin
- Student: https://your-app.vercel.app/dashboard
- Login: https://your-app.vercel.app/

## Troubleshooting
- Check Vercel function logs for errors
- Verify environment variables are set
- Test database connection in production
\`\`\`

Let's also create a production-ready authentication system:
