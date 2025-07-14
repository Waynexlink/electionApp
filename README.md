# Voting Platform - MongoDB Setup Guide

## Quick Setup with MongoDB Atlas (Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

### Step 2: Get Connection String
1. In your Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string (it looks like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>`)

### Step 3: Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Replace the `MONGODB_URI` with your Atlas connection string
3. Replace `<username>`, `<password>`, and `<database>` with your actual values

Example:
```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/voting-platform?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
```

### Step 4: Initialize Database
1. Start the application: `npm run dev`
2. Go to `/admin` page
3. Click "Initialize MongoDB Database" button
4. Use demo credentials to login

## Demo Credentials (After Database Initialization)
- **Admin**: admin@university.edu / password123
- **Student**: student@university.edu / password123

## Alternative: Local MongoDB Setup
If you prefer to run MongoDB locally:

1. Install MongoDB on your system
2. Start MongoDB service: `mongod`
3. Use this connection string in `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/voting-platform
   ```

## Troubleshooting
- **Connection refused error**: MongoDB server is not running or connection string is incorrect
- **Authentication failed**: Check username/password in connection string
- **Network error**: Check if your IP is whitelisted in Atlas (or use 0.0.0.0/0 for development)