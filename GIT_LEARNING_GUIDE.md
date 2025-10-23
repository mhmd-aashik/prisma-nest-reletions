# 🌿 Git Branches - Learning Guide

This project uses Git branches to organize the learning material. Each branch represents a specific learning module or concept.

## 📚 Branch Structure

### Learning Branches (In Order)

```
main
 ├── 01-setup-and-configuration
 ├── 02-prisma-service-module
 ├── 03-one-to-one-users-profiles
 ├── 04-one-to-many-and-many-to-many-posts
 ├── 05-categories-many-to-many
 ├── 06-comments-multiple-foreign-keys
 ├── 07-app-integration-and-seed
 └── 08-documentation-and-guides
```

## 🎯 How to Use These Branches

### Option 1: View All at Once (Recommended for Quick Start)

Stay on `main` branch - it has everything merged:

```bash
# You're already here!
git checkout main
```

### Option 2: Step-by-Step Learning (Recommended for Deep Learning)

Checkout each branch in order to see the progressive development:

```bash
# Branch 1: Setup
git checkout 01-setup-and-configuration
# Study: docker-compose.yml, prisma/schema.prisma, package.json

# Branch 2: Prisma Integration
git checkout 02-prisma-service-module
# Study: src/prisma/

# Branch 3: ONE-TO-ONE
git checkout 03-one-to-one-users-profiles
# Study: src/users/

# Branch 4: ONE-TO-MANY & MANY-TO-MANY
git checkout 04-one-to-many-and-many-to-many-posts
# Study: src/posts/

# Branch 5: MANY-TO-MANY (Inverse)
git checkout 05-categories-many-to-many
# Study: src/categories/

# Branch 6: Multiple Relationships
git checkout 06-comments-multiple-foreign-keys
# Study: src/comments/

# Branch 7: Integration
git checkout 07-app-integration-and-seed
# Study: src/app.module.ts, prisma/seed.ts

# Branch 8: Documentation
git checkout 08-documentation-and-guides
# Study: All .md files

# Back to main
git checkout main
```

### Option 3: Compare Changes

See what each branch added:

```bash
# What was added in setup branch?
git diff main 01-setup-and-configuration

# What's different in users module?
git diff 02-prisma-service-module 03-one-to-one-users-profiles

# See all changes with file names
git diff --name-status 01-setup-and-configuration 02-prisma-service-module
```

### Option 4: View Specific Files from Branches

Look at files without switching branches:

```bash
# View users service from its branch
git show 03-one-to-one-users-profiles:src/users/users.service.ts

# View schema from setup branch
git show 01-setup-and-configuration:prisma/schema.prisma
```

---

## 📖 Branch Details

### 1️⃣ 01-setup-and-configuration

**Focus:** Project foundation and Prisma setup

**Files Added:**

- `docker-compose.yml` - PostgreSQL container
- `env.example` - Environment variables template
- `prisma.config.ts` - Prisma configuration
- `prisma/schema.prisma` - Database schema with all models

**Learning Objectives:**

- Understand Docker setup for PostgreSQL
- Learn Prisma schema syntax
- Understand relationship definitions
- See all model structures

**Study Time:** 30 minutes

**Commands to Try:**

```bash
git checkout 01-setup-and-configuration
cat prisma/schema.prisma  # Read the schema
cat docker-compose.yml     # See Docker config
```

---

### 2️⃣ 02-prisma-service-module

**Focus:** Integrating Prisma with NestJS

**Files Added:**

- `src/prisma/prisma.service.ts` - Database service
- `src/prisma/prisma.module.ts` - Prisma module

**Learning Objectives:**

- Prisma Client setup in NestJS
- Service lifecycle hooks
- Global module pattern
- Database connection management

**Study Time:** 20 minutes

**Commands to Try:**

```bash
git checkout 02-prisma-service-module
cat src/prisma/prisma.service.ts  # Study the service
```

---

### 3️⃣ 03-one-to-one-users-profiles

**Focus:** ONE-TO-ONE relationships

**Files Added:**

- `src/users/users.service.ts` - Business logic
- `src/users/users.controller.ts` - API endpoints
- `src/users/users.module.ts` - Module definition

**Learning Objectives:**

- ONE-TO-ONE relationship setup
- Nested creates
- Optional relationships
- Cascade deletes
- Include vs Select

**Study Time:** 1 hour

**Commands to Try:**

```bash
git checkout 03-one-to-one-users-profiles

# Read service file
cat src/users/users.service.ts

# See what changed from previous branch
git diff 02-prisma-service-module..03-one-to-one-users-profiles
```

---

### 4️⃣ 04-one-to-many-and-many-to-many-posts

**Focus:** Complex relationships

**Files Added:**

- `src/posts/posts.service.ts`
- `src/posts/posts.controller.ts`
- `src/posts/posts.module.ts`

**Learning Objectives:**

- ONE-TO-MANY from child side
- MANY-TO-MANY with explicit join table
- Multiple relationships on one model
- Nested includes
- Connect vs Create

**Study Time:** 1.5 hours

**Commands to Try:**

```bash
git checkout 04-one-to-many-and-many-to-many-posts
cat src/posts/posts.service.ts

# Compare with users module
git diff 03-one-to-one-users-profiles..04-one-to-many-and-many-to-many-posts src/posts/
```

---

### 5️⃣ 05-categories-many-to-many

**Focus:** MANY-TO-MANY from the other side

**Files Added:**

- `src/categories/categories.service.ts`
- `src/categories/categories.controller.ts`
- `src/categories/categories.module.ts`

**Learning Objectives:**

- Inverse side of MANY-TO-MANY
- Unique constraints
- Error handling
- Aggregations with counts

**Study Time:** 45 minutes

**Commands to Try:**

```bash
git checkout 05-categories-many-to-many
cat src/categories/categories.service.ts
```

---

### 6️⃣ 06-comments-multiple-foreign-keys

**Focus:** Multiple relationships on one model

**Files Added:**

- `src/comments/comments.service.ts`
- `src/comments/comments.controller.ts`
- `src/comments/comments.module.ts`

**Learning Objectives:**

- Multiple foreign keys
- Querying by different relationships
- Filtering options

**Study Time:** 30 minutes

**Commands to Try:**

```bash
git checkout 06-comments-multiple-foreign-keys
cat src/comments/comments.service.ts
```

---

### 7️⃣ 07-app-integration-and-seed

**Focus:** Complete application setup

**Files Modified/Added:**

- `src/app.module.ts` - Import all modules
- `src/main.ts` - Bootstrap configuration
- `prisma/seed.ts` - Sample data script

**Learning Objectives:**

- Module integration
- Application bootstrap
- Seeding database with relationships
- Complete working app

**Study Time:** 45 minutes

**Commands to Try:**

```bash
git checkout 07-app-integration-and-seed
cat src/app.module.ts
cat prisma/seed.ts  # See how to create data with relationships
```

---

### 8️⃣ 08-documentation-and-guides

**Focus:** Learning materials

**Files Added:**

- `README.md` - Complete documentation
- `QUICK_START.md` - Quick setup guide
- `RELATIONSHIPS_GUIDE.md` - Relationships deep dive
- `LEARNING_ROADMAP.md` - 7-day learning path

**Learning Objectives:**

- Documentation structure
- Learning resources
- API documentation
- Practice exercises

**Study Time:** Reference material

---

## 🎓 Recommended Learning Paths

### Path 1: Fast Track (2-3 hours)

```bash
# 1. Read README.md on main
git checkout main
cat README.md

# 2. Study schema
cat prisma/schema.prisma

# 3. Pick one relationship type and study
cat src/users/users.service.ts    # ONE-TO-ONE

# 4. Try the API
npm run start:dev
curl http://localhost:3000/users
```

### Path 2: Thorough Learning (1-2 days)

```bash
# Day 1: Setup and ONE-TO-ONE
git checkout 01-setup-and-configuration  # Study 30 min
git checkout 02-prisma-service-module    # Study 20 min
git checkout 03-one-to-one-users-profiles # Study 1 hour, practice

# Day 2: Complex relationships
git checkout 04-one-to-many-and-many-to-many-posts  # Study 1.5 hours
git checkout 05-categories-many-to-many             # Study 45 min
git checkout 06-comments-multiple-foreign-keys      # Study 30 min

# Test everything
git checkout main
npm run start:dev
# Try all endpoints
```

### Path 3: Deep Dive (1 week)

Follow the [LEARNING_ROADMAP.md](./LEARNING_ROADMAP.md) and checkout corresponding branches for each day.

---

## 💡 Tips for Using Branches

### 1. Keep Main Safe

```bash
# Always work on a new branch
git checkout -b my-experiments
# Experiment freely without affecting main
```

### 2. Compare Your Changes

```bash
# See what you changed
git diff main

# See what files changed
git status
```

### 3. Reset If Needed

```bash
# Discard all local changes
git checkout .

# Reset to branch state
git reset --hard
```

### 4. Search Across Branches

```bash
# Find where something is defined
git grep "createWithProfile" $(git rev-list --all)

# Search in specific branch
git grep "ONE-TO-ONE" 03-one-to-one-users-profiles
```

### 5. View History

```bash
# See all commits
git log --oneline --graph --all

# See commits in a branch
git log 03-one-to-one-users-profiles

# See what a commit did
git show <commit-hash>
```

---

## 🔍 Quick Reference

### See All Branches

```bash
git branch -a
```

### Switch Branches

```bash
git checkout <branch-name>
```

### View Changes

```bash
git diff <branch1> <branch2>
```

### View File from Branch

```bash
git show <branch>:<file-path>
```

### Search Code

```bash
git grep "<search-term>" <branch>
```

### Go Back to Main

```bash
git checkout main
```

---

## 📝 Learning Checklist

Track which branches you've studied:

- [ ] 01-setup-and-configuration
  - [ ] Understood Docker setup
  - [ ] Read schema completely
  - [ ] Understand all relationships

- [ ] 02-prisma-service-module
  - [ ] Understand Prisma service
  - [ ] Know lifecycle hooks
  - [ ] Understand global modules

- [ ] 03-one-to-one-users-profiles
  - [ ] Can create ONE-TO-ONE
  - [ ] Understand nested creates
  - [ ] Know cascade behavior

- [ ] 04-one-to-many-and-many-to-many-posts
  - [ ] Can create ONE-TO-MANY
  - [ ] Understand MANY-TO-MANY
  - [ ] Know join tables

- [ ] 05-categories-many-to-many
  - [ ] Understand inverse MANY-TO-MANY
  - [ ] Can handle errors
  - [ ] Know aggregations

- [ ] 06-comments-multiple-foreign-keys
  - [ ] Understand multiple FKs
  - [ ] Can query by relationships

- [ ] 07-app-integration-and-seed
  - [ ] Understand module integration
  - [ ] Can seed data
  - [ ] Can run complete app

- [ ] 08-documentation-and-guides
  - [ ] Read all documentation
  - [ ] Completed exercises

---

## 🎯 Next Steps

After studying all branches:

1. **Practice**
   - Checkout main
   - Try all API endpoints
   - Experiment with queries

2. **Experiment**
   - Create your own branch
   - Modify the code
   - Add new features

3. **Build**
   - Start your own project
   - Apply these patterns
   - Reference when needed

---

## 📚 Resources

- **Main Documentation:** `README.md`
- **Quick Start:** `QUICK_START.md`
- **Relationships Guide:** `RELATIONSHIPS_GUIDE.md`
- **Learning Path:** `LEARNING_ROADMAP.md`
- **Project Summary:** `PROJECT_SUMMARY.md`

---

**Happy Learning!** 🚀

Use these branches as a reference whenever you need to understand how a specific relationship or feature is implemented.
