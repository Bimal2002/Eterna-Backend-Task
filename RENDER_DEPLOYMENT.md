# Deploy to Render.com (Free Tier)

## 🚨 Important: Render's Free Tier Limitations

**Redis is NOT free on Render.** Here's how to deploy for free:

---

## ✅ Free Deployment Strategy

### Option 1: Use Upstash Redis (Recommended)
Upstash provides **free Redis** (10,000 commands/day) that works perfectly with Render.

### Option 2: Use Railway (Better for this project)
Railway offers PostgreSQL + Redis both free in one place.

---

## 📋 Step-by-Step: Render + Upstash (Free)

### Part 1: Setup Upstash Redis (Free)

1. **Sign up at [Upstash](https://upstash.com)**
   - Use GitHub to sign up

2. **Create Redis Database**
   - Click "Create Database"
   - Choose region closest to you
   - Select "Free" plan
   - Click "Create"

3. **Copy Redis URL**
   - Click on your database
   - Scroll to **"Connect"** section (NOT REST API)
   - Copy the **Redis URL** (starts with `rediss://`)
   - It looks like: `rediss://default:xxx@xxx.upstash.io:6379`
   - **Important**: Use the TLS/SSL URL (rediss:// with double 's')

---

### Part 2: Deploy to Render

#### 1. Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `order-execution-db`
   - **Database**: `orders_db`
   - **User**: `postgres`
   - **Region**: Choose closest to you
   - **Instance Type**: **Free**
4. Click **"Create Database"**
5. Wait 2-3 minutes for provisioning
6. Copy the **Internal Database URL** (you'll need this)

#### 2. Deploy Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Eterna-Backend-Task`
3. Configure:
   
   **Basic Settings:**
   - **Name**: `order-execution-engine`
   - **Region**: Same as database
   - **Branch**: `master`
   - **Root Directory**: (leave empty)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

   **Instance Type:**
   - Select **Free**

4. Click **"Advanced"** and add Environment Variables:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://orders_db_ere2_user:uEstBmlGveHYQ8vYpsQKLFqSlrJreE1r@dpg-d4imv42li9vc73em5flg-a/orders_db_ere2
REDIS_URL=rediss://default:ATe0AAIncDI0NmQ0YTMyZGVhZTY0YTk1YTBhZDg2YjA5Zjk0ODI3OXAyMTQyNjA@steady-thrush-14260.upstash.io:6379
BULLMQ_PREFIX=oe:
CONCURRENT_ORDERS=10
```

**⚠️ Note:**
- These are your actual credentials from Render PostgreSQL and Upstash Redis
- `DATABASE_URL` uses the Internal connection string (starts with `postgresql://`)
- `REDIS_URL` must use `rediss://` (TLS/SSL) format, not HTTPS
- Format: `rediss://default:YOUR_TOKEN@YOUR_HOST.upstash.io:6379`

5. Click **"Create Web Service"**

#### 3. Run Database Migration

After deployment succeeds:

1. Go to your Web Service dashboard
2. Click **"Shell"** tab
3. Run:
```bash
npx prisma migrate deploy
```

This creates your database schema.

---

### Part 3: Test Your Deployment

Your API will be at: `https://order-execution-engine.onrender.com`

**Test with Postman:**
```
POST https://order-execution-engine.onrender.com/api/orders/execute

Headers:
Content-Type: application/json

Body:
{
  "type": "market",
  "tokenIn": "SOL",
  "tokenOut": "USDC",
  "amount": 1
}
```

**WebSocket:**
```
wss://order-execution-engine.onrender.com/api/orders/status/{orderId}
```

---

## 🎯 Alternative: Deploy to Railway (Easier & Free)

Railway provides PostgreSQL + Redis **both free** with better performance.

### Quick Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select `Eterna-Backend-Task`
5. Railway auto-detects your app

**Add Services:**

1. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Click **"+ New"** → **"Database"** → **"Add Redis"**

**Environment Variables** (Railway sets these automatically):
- `DATABASE_URL` - Auto-set from PostgreSQL service
- `REDIS_URL` - Auto-set from Redis service

You only need to add:
```env
NODE_ENV=production
PORT=3000
BULLMQ_PREFIX=oe:
CONCURRENT_ORDERS=10
```

**Deploy:**
- Railway builds and deploys automatically
- Run migration in Railway console: `npx prisma migrate deploy`

---

## 📊 Comparison

| Platform | PostgreSQL | Redis | Setup Difficulty | Free Tier |
|----------|-----------|-------|------------------|-----------|
| **Render + Upstash** | ✅ Free | ✅ Free (via Upstash) | Medium | 750 hours/month |
| **Railway** | ✅ Free | ✅ Free | Easy | $5 credit/month |
| **Fly.io** | ✅ Free | ✅ Free | Hard (Docker) | 3 VMs free |

**Recommendation:** Use **Railway** - it's the easiest and handles Redis + PostgreSQL together.

---

## 🐛 Troubleshooting

### Render Build Fails
- Check build logs in dashboard
- Ensure `package.json` has `"start": "node dist/index.js"`
- Verify TypeScript compiles: run `npm run build` locally

### Database Connection Error
- Make sure you're using **Internal Database URL** (not External)
- Check DATABASE_URL format: `postgresql://user:pass@host:5432/dbname`

### Redis Connection Error
- Verify Upstash URL starts with `rediss://` (with double 's')
- Check Upstash dashboard for connection errors

### Migration Fails
- Run `npx prisma generate` first, then `npx prisma migrate deploy`
- Check database permissions

### Free Tier Sleeps
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Use cron-job.org to ping every 10 minutes to keep it awake

---

## 📝 Required Files (Already in Repo)

✅ `package.json` - Has build & start scripts
✅ `tsconfig.json` - Configured correctly
✅ `prisma/schema.prisma` - Database schema
✅ `.gitignore` - Excludes node_modules, dist, .env

---

## 🎉 Summary

**For Free Deployment:**
1. **Easiest**: Railway (PostgreSQL + Redis included)
2. **Alternative**: Render + Upstash Redis

Both options are 100% free and will work perfectly for this project.

**Live URL Example:**
- Render: `https://your-app.onrender.com`
- Railway: `https://your-app.up.railway.app`
