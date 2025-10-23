# 🗺️ Prisma Learning Roadmap

Follow this roadmap to master Prisma ORM and database relationships step by step.

## 📚 Learning Phases

### Phase 1: Setup & Basics (Day 1)

**Goal:** Get the project running and understand the basics

#### Tasks:

- [ ] Follow [QUICK_START.md](./QUICK_START.md) to set up the project
- [ ] Start Docker PostgreSQL
- [ ] Run migrations and seed data
- [ ] Open Prisma Studio (`npm run prisma:studio`)
- [ ] Start the app (`npm run start:dev`)

#### Learning Points:

- What is Prisma?
- How does Prisma Client work?
- Understanding `schema.prisma` file
- Database connection strings

#### Resources to Study:

- [prisma/schema.prisma](./prisma/schema.prisma) - Read all comments
- [src/prisma/prisma.service.ts](./src/prisma/prisma.service.ts) - How Prisma integrates with NestJS

---

### Phase 2: ONE-TO-ONE Relationships (Day 2)

**Goal:** Master ONE-TO-ONE relationships

#### Tasks:

- [ ] Read User and Profile models in schema
- [ ] Study [src/users/users.service.ts](./src/users/users.service.ts)
- [ ] Create users with profiles via API
- [ ] Update profiles
- [ ] View relationships in Prisma Studio

#### Practical Exercises:

```bash
# 1. Create user with profile
curl -X POST http://localhost:3000/users/with-profile \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "name": "Test User",
    "profile": {
      "bio": "Learning Prisma",
      "website": "https://test.com"
    }
  }'

# 2. Get user with profile
curl http://localhost:3000/users/1

# 3. Update profile
curl -X PATCH http://localhost:3000/users/1/profile \
  -H "Content-Type: application/json" \
  -d '{"bio": "Updated bio"}'

# 4. Delete user (watch cascade delete)
curl -X DELETE http://localhost:3000/users/1
```

#### Key Concepts to Understand:

- `@unique` constraint on foreign key
- Optional relationships (`Profile?`)
- Nested create operations
- Cascade delete behavior
- `include` vs `select`

#### Challenge:

Create a new ONE-TO-ONE relationship:

- Add `UserSettings` model
- Each user has optional settings
- Include fields like theme, language, notifications

---

### Phase 3: ONE-TO-MANY Relationships (Day 3)

**Goal:** Master ONE-TO-MANY relationships

#### Tasks:

- [ ] Read User and Post models
- [ ] Read Post and Comment models
- [ ] Study [src/posts/posts.service.ts](./src/posts/posts.service.ts)
- [ ] Create posts for users
- [ ] Add comments to posts
- [ ] Query nested relationships

#### Practical Exercises:

```bash
# 1. Create a post
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Test Post",
    "content": "Learning ONE-TO-MANY",
    "authorId": 1,
    "published": true
  }'

# 2. Get user with all posts
curl "http://localhost:3000/users/1?includeRelations=true"

# 3. Add comment to post
curl -X POST http://localhost:3000/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great post!",
    "authorId": 2
  }'

# 4. Get all comments for a post
curl http://localhost:3000/comments/by-post/1
```

#### Key Concepts to Understand:

- Foreign keys without `@unique`
- Array notation in schema (`Post[]`)
- Filtering related records (`where`, `some`, `every`, `none`)
- Counting related records (`_count`)
- Ordering and pagination
- Nested includes

#### Challenges:

1. **Add Likes System:**
   - Create `Like` model
   - User can like many posts (ONE-TO-MANY)
   - Post can have many likes (ONE-TO-MANY)
   - Prevent duplicate likes

2. **Add Post Views:**
   - Track view count
   - Track who viewed (ONE-TO-MANY relationship)

---

### Phase 4: MANY-TO-MANY Relationships (Day 4-5)

**Goal:** Master MANY-TO-MANY relationships

#### Tasks:

- [ ] Read Post and Category models
- [ ] Understand PostCategory join table
- [ ] Study MANY-TO-MANY operations
- [ ] Compare implicit vs explicit MANY-TO-MANY

#### Practical Exercises:

```bash
# 1. Create categories
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "AI/ML", "slug": "ai-ml"}'

curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "DevOps", "slug": "devops"}'

# 2. Create post with categories
curl -X POST http://localhost:3000/posts/with-categories \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ML and DevOps Together",
    "content": "How to deploy ML models",
    "authorId": 1,
    "published": true,
    "categoryIds": [1, 2]
  }'

# 3. Add more categories to post
curl -X POST http://localhost:3000/posts/1/categories \
  -H "Content-Type: application/json" \
  -d '{"categoryIds": [3, 4]}'

# 4. Get posts by category
curl http://localhost:3000/posts/by-category/1

# 5. Remove category from post
curl -X DELETE http://localhost:3000/posts/1/categories/2
```

#### Key Concepts to Understand:

- Explicit vs Implicit MANY-TO-MANY
- Join table design
- `@@unique([postId, categoryId])` constraint
- `skipDuplicates` option
- Querying through relationships
- Additional fields in join table

#### Challenges:

1. **Add Tags System:**
   - Create implicit MANY-TO-MANY between Post and Tag
   - Compare with explicit PostCategory

2. **Add Followers System:**
   - User can follow many users
   - User can be followed by many users
   - Self-referential MANY-TO-MANY

---

### Phase 5: Advanced Queries (Day 6)

**Goal:** Master complex queries

#### Tasks:

- [ ] Read [RELATIONSHIPS_GUIDE.md](./RELATIONSHIPS_GUIDE.md) Advanced section
- [ ] Practice nested includes
- [ ] Use filtering operators
- [ ] Implement aggregations
- [ ] Use transactions

#### Exercises:

**1. Deep Nested Query:**

```typescript
// Get user with posts, categories, and comments with authors
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    profile: true,
    posts: {
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        comments: {
          include: {
            author: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    },
  },
});
```

**2. Complex Filtering:**

```typescript
// Find users who:
// - Have at least 5 posts
// - Have commented on other users' posts
// - Have a profile
const users = await prisma.user.findMany({
  where: {
    AND: [
      {
        posts: {
          some: {},
        },
      },
      {
        comments: {
          some: {},
        },
      },
      {
        profile: {
          isNot: null,
        },
      },
    ],
  },
  include: {
    _count: {
      select: {
        posts: true,
        comments: true,
      },
    },
  },
});
```

**3. Transaction Example:**

```typescript
// Create user, profile, and first post in transaction
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'new@example.com' },
  });

  const profile = await tx.profile.create({
    data: {
      bio: 'New user',
      userId: user.id,
    },
  });

  const post = await tx.post.create({
    data: {
      title: 'First Post',
      authorId: user.id,
    },
  });

  return { user, profile, post };
});
```

#### Challenges:

1. Find all posts that have comments from their own author
2. Get the top 10 most active users (by posts + comments count)
3. Find categories with no posts
4. Get users who have never commented

---

### Phase 6: Real-World Patterns (Day 7)

**Goal:** Apply knowledge to real scenarios

#### Tasks:

- [ ] Implement soft delete
- [ ] Add full-text search
- [ ] Implement pagination
- [ ] Add data validation
- [ ] Handle errors properly

#### Practical Projects:

**1. Blog System Enhancement:**

- Add post drafts and publish workflow
- Implement featured posts
- Add post series (posts can belong to a series)
- Track post revisions

**2. Social Features:**

- Implement follower system
- Add post bookmarks/saves
- Implement user mentions in comments
- Add notification system

**3. Analytics:**

- Track popular posts
- Calculate user engagement scores
- Generate category statistics
- Build trending algorithm

---

## 📊 Progress Checklist

Track your progress:

### Core Concepts

- [ ] Understand Prisma schema syntax
- [ ] Know how to define models
- [ ] Understand relationship types
- [ ] Know cascade behaviors
- [ ] Understand Prisma Client generation

### ONE-TO-ONE

- [ ] Define in schema
- [ ] Create with nested data
- [ ] Query both directions
- [ ] Update related data
- [ ] Handle optional relationships

### ONE-TO-MANY

- [ ] Define in schema
- [ ] Create parent with children
- [ ] Create child for parent
- [ ] Query with filtering
- [ ] Count related records
- [ ] Implement pagination

### MANY-TO-MANY

- [ ] Understand implicit vs explicit
- [ ] Create with join table
- [ ] Add/remove relationships
- [ ] Query through relationships
- [ ] Prevent duplicates
- [ ] Store extra data in join table

### Advanced

- [ ] Deep nested queries
- [ ] Complex filtering (some, every, none)
- [ ] Aggregations and counting
- [ ] Transactions
- [ ] Batch operations
- [ ] Raw queries (when needed)
- [ ] Performance optimization

---

## 🎯 Final Project Ideas

Apply everything you learned:

### 1. E-Commerce Platform

- Products (categories, tags, variants)
- Orders (items, shipping, payment)
- Reviews (ratings, helpful votes)
- Users (addresses, wishlists, cart)

### 2. Social Media Platform

- Posts (images, hashtags, mentions)
- Comments (nested replies)
- Likes, shares, saves
- Followers, blocking
- Messages (conversations)

### 3. Learning Management System

- Courses (modules, lessons, quizzes)
- Enrollments
- Progress tracking
- Certificates
- Discussions

### 4. Project Management Tool

- Projects (tasks, milestones)
- Team members (roles, permissions)
- Comments and attachments
- Time tracking
- Notifications

---

## 📖 Additional Resources

### Official Documentation

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

### This Project

- [README.md](./README.md) - Full documentation
- [RELATIONSHIPS_GUIDE.md](./RELATIONSHIPS_GUIDE.md) - Detailed relationship guide
- [QUICK_START.md](./QUICK_START.md) - Setup guide

### Community

- [Prisma Discord](https://pris.ly/discord)
- [Prisma GitHub](https://github.com/prisma/prisma)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/prisma)

---

## 💡 Tips for Success

1. **Practice Daily:** Spend at least 1 hour each day
2. **Experiment:** Try breaking things and fixing them
3. **Read Code:** Study the service files thoroughly
4. **Use Prisma Studio:** Visual tool helps understanding
5. **Write Tests:** Test your understanding
6. **Build Projects:** Apply knowledge to real problems
7. **Ask Questions:** Use Discord, Stack Overflow
8. **Read Errors:** Prisma errors are very descriptive

---

## ✅ Completion Criteria

You've mastered Prisma when you can:

- [ ] Design database schema for any application
- [ ] Choose appropriate relationship types
- [ ] Write efficient queries
- [ ] Handle complex nested data
- [ ] Optimize for performance
- [ ] Debug relationship issues
- [ ] Migrate schema changes safely
- [ ] Build production-ready APIs

---

Good luck on your Prisma journey! 🚀

Remember: **Practice is key. Build real projects!**
