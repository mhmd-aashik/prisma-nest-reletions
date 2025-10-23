# 🚀 Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

✅ Node.js installed  
✅ Docker Desktop installed and running  

## Step-by-Step Setup

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Set Up Environment
```bash
# Copy the environment variables
cp env.example .env
```

### 3️⃣ Start PostgreSQL Database
```bash
# Start Docker container
npm run docker:up

# Wait a few seconds for PostgreSQL to start
# You should see: ✔ Container prisma-learn-postgres  Started
```

### 4️⃣ Set Up Database Schema
```bash
# Create database tables
npm run prisma:migrate

# When prompted for migration name, type: init
# Press Enter
```

### 5️⃣ Generate Prisma Client
```bash
npm run prisma:generate
```

### 6️⃣ Seed Sample Data
```bash
npm run prisma:seed
```

### 7️⃣ Start the Application
```bash
npm run start:dev
```

### 8️⃣ Test the API

Open your browser or use curl:

```bash
# Get all users
curl http://localhost:3000/users

# Get user with relationships
curl http://localhost:3000/users/1

# Get all posts
curl http://localhost:3000/posts?includeRelations=true
```

## 🎉 You're Ready!

Now you can:
- 📖 Read the full [README.md](./README.md)
- 🔍 Open Prisma Studio: `npm run prisma:studio`
- 🧪 Explore the API endpoints
- 📝 Study the code in `src/` directory

## 🔄 Quick Reset

If you want to start fresh:

```bash
# Reset database and reseed
npm run prisma:reset
```

## ❓ Having Issues?

### Docker not running?
```bash
# macOS: Open Docker Desktop
open -a Docker
```

### Port 5432 already in use?
```bash
# Stop existing PostgreSQL
brew services stop postgresql  # macOS
sudo systemctl stop postgresql  # Linux
```

### Still stuck?
Check the [Troubleshooting](./README.md#-troubleshooting) section in README.md

---

**Next Steps:** Open [README.md](./README.md) to learn about database relationships! 📚

