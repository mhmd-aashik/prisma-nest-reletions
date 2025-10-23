# 📚 Learning Prisma ORM with NestJS - Database Relationships

A comprehensive tutorial project demonstrating all types of database relationships using Prisma ORM with NestJS and PostgreSQL.

## 🎯 What You'll Learn

This project demonstrates:

- **ONE-TO-ONE** relationships (User ↔ Profile)
- **ONE-TO-MANY** relationships (User → Posts, Post → Comments)
- **MANY-TO-MANY** relationships (Posts ↔ Categories)
- Prisma Client setup with NestJS
- CRUD operations with relationships
- Cascade deletes and relationship management
- Querying nested relationships

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker Desktop (for PostgreSQL)
- Basic knowledge of TypeScript and REST APIs

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env
```

### 2. Start PostgreSQL with Docker

```bash
# Start PostgreSQL container
npm run docker:up

# Check if container is running
docker ps

# View logs (optional)
npm run docker:logs
```

### 3. Set Up Database

```bash
# Run database migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Seed database with sample data
npm run prisma:seed
```

### 4. Start the Application

```bash
# Development mode with hot-reload
npm run start:dev

# The application will be available at http://localhost:3000
```

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐
│    User     │────────▶│   Profile   │  ONE-TO-ONE
│ (id, email) │         │ (bio, etc)  │
└─────────────┘         └─────────────┘
      │
      │ ONE-TO-MANY
      ▼
┌─────────────┐         ┌──────────────┐
│    Post     │◀───────▶│  Category    │  MANY-TO-MANY
│(title, etc) │         │ (name, slug) │  (via PostCategory)
└─────────────┘         └──────────────┘
      │
      │ ONE-TO-MANY
      ▼
┌─────────────┐
│   Comment   │
│  (content)  │
└─────────────┘
```

### Models

#### 1. **User** (users table)

```typescript
- id: number
- email: string (unique)
- name: string?
- createdAt: DateTime
- updatedAt: DateTime
Relations:
  - profile: Profile? (ONE-TO-ONE)
  - posts: Post[] (ONE-TO-MANY)
  - comments: Comment[] (ONE-TO-MANY)
```

#### 2. **Profile** (profiles table)

```typescript
- id: number
- bio: string?
- avatar: string?
- website: string?
- userId: number (unique)
Relations:
  - user: User (ONE-TO-ONE)
```

#### 3. **Post** (posts table)

```typescript
- id: number
- title: string
- content: string?
- published: boolean
- authorId: number
Relations:
  - author: User (MANY-TO-ONE)
  - categories: PostCategory[] (MANY-TO-MANY)
  - comments: Comment[] (ONE-TO-MANY)
```

#### 4. **Category** (categories table)

```typescript
- id: number
- name: string (unique)
- slug: string (unique)
Relations:
  - posts: PostCategory[] (MANY-TO-MANY)
```

#### 5. **PostCategory** (post_categories table)

```typescript
- id: number
- postId: number
- categoryId: number
Relations:
  - post: Post
  - category: Category
```

#### 6. **Comment** (comments table)

```typescript
- id: number
- content: string
- postId: number
- authorId: number
Relations:
  - post: Post (MANY-TO-ONE)
  - author: User (MANY-TO-ONE)
```

## 🔌 API Endpoints

### Users

| Method | Endpoint                       | Description                           |
| ------ | ------------------------------ | ------------------------------------- |
| GET    | `/users`                       | Get all users                         |
| GET    | `/users?includeRelations=true` | Get all users with relationships      |
| GET    | `/users/:id`                   | Get user with all relationships       |
| GET    | `/users/:id/stats`             | Get user statistics                   |
| POST   | `/users`                       | Create a new user                     |
| POST   | `/users/with-profile`          | Create user with profile (ONE-TO-ONE) |
| PATCH  | `/users/:id`                   | Update user                           |
| PATCH  | `/users/:id/profile`           | Update user's profile                 |
| DELETE | `/users/:id`                   | Delete user (CASCADE)                 |

### Posts

| Method | Endpoint                            | Description                     |
| ------ | ----------------------------------- | ------------------------------- |
| GET    | `/posts`                            | Get all posts                   |
| GET    | `/posts?includeRelations=true`      | Get posts with relationships    |
| GET    | `/posts/:id`                        | Get post with all relationships |
| GET    | `/posts/:id/stats`                  | Get post statistics             |
| GET    | `/posts/by-category/:categoryId`    | Get posts by category           |
| POST   | `/posts`                            | Create a new post               |
| POST   | `/posts/with-categories`            | Create post with categories     |
| POST   | `/posts/:id/categories`             | Add categories to post          |
| POST   | `/posts/:id/comments`               | Add comment to post             |
| PATCH  | `/posts/:id`                        | Update post                     |
| DELETE | `/posts/:id`                        | Delete post (CASCADE)           |
| DELETE | `/posts/:id/categories/:categoryId` | Remove category from post       |

### Categories

| Method | Endpoint                        | Description               |
| ------ | ------------------------------- | ------------------------- |
| GET    | `/categories`                   | Get all categories        |
| GET    | `/categories?includePosts=true` | Get categories with posts |
| GET    | `/categories/popular`           | Get popular categories    |
| GET    | `/categories/:id`               | Get category with posts   |
| GET    | `/categories/:id/stats`         | Get category statistics   |
| GET    | `/categories/slug/:slug`        | Get category by slug      |
| POST   | `/categories`                   | Create a new category     |
| PATCH  | `/categories/:id`               | Update category           |
| DELETE | `/categories/:id`               | Delete category           |

### Comments

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| GET    | `/comments`                 | Get all comments        |
| GET    | `/comments?postId=1`        | Get comments by post    |
| GET    | `/comments?authorId=1`      | Get comments by author  |
| GET    | `/comments/by-post/:postId` | Get comments for a post |
| GET    | `/comments/by-user/:userId` | Get comments by user    |
| GET    | `/comments/:id`             | Get single comment      |
| POST   | `/comments`                 | Create a new comment    |
| PATCH  | `/comments/:id`             | Update comment          |
| DELETE | `/comments/:id`             | Delete comment          |

## 📝 Example API Requests

### 1. Create a User with Profile (ONE-TO-ONE)

```bash
curl -X POST http://localhost:3000/users/with-profile \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "name": "Alice Wonder",
    "profile": {
      "bio": "Software Engineer",
      "avatar": "https://example.com/alice.jpg",
      "website": "https://alice.dev"
    }
  }'
```

### 2. Create a Post with Categories (MANY-TO-MANY)

```bash
curl -X POST http://localhost:3000/posts/with-categories \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "Learning Prisma is fun!",
    "published": true,
    "authorId": 1,
    "categoryIds": [1, 2, 3]
  }'
```

### 3. Add a Comment to a Post (ONE-TO-MANY)

```bash
curl -X POST http://localhost:3000/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great post!",
    "authorId": 2
  }'
```

### 4. Get User with All Relationships

```bash
curl http://localhost:3000/users/1
```

This returns:

```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "profile": { ... },
  "posts": [ ... ],
  "comments": [ ... ]
}
```

## 🔍 Understanding Relationships

### 1. ONE-TO-ONE (User ↔ Profile)

A user has **one** profile, and a profile belongs to **one** user.

**Schema:**

```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile? // Optional ONE-TO-ONE
}

model Profile {
  id     Int  @id @default(autoincrement())
  userId Int  @unique // @unique ensures one profile per user
  user   User @relation(fields: [userId], references: [id])
}
```

**Creating:**

```typescript
// Create user with profile
await prisma.user.create({
  data: {
    email: 'john@example.com',
    profile: {
      create: { bio: 'Developer' },
    },
  },
});
```

**Querying:**

```typescript
// Get user with profile
await prisma.user.findUnique({
  where: { id: 1 },
  include: { profile: true },
});
```

### 2. ONE-TO-MANY (User → Posts)

A user can have **many** posts, but a post belongs to **one** user.

**Schema:**

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[] // ONE-TO-MANY
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```

**Creating:**

```typescript
// Create post for user
await prisma.post.create({
  data: {
    title: 'My Post',
    authorId: 1,
  },
});
```

**Querying:**

```typescript
// Get user with all posts
await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },
});
```

### 3. MANY-TO-MANY (Posts ↔ Categories)

A post can have **many** categories, and a category can have **many** posts.

**Schema (Explicit Join Table):**

```prisma
model Post {
  id         Int            @id @default(autoincrement())
  categories PostCategory[] // MANY-TO-MANY
}

model Category {
  id    Int            @id @default(autoincrement())
  posts PostCategory[] // MANY-TO-MANY
}

model PostCategory {
  id         Int      @id @default(autoincrement())
  postId     Int
  categoryId Int
  post       Post     @relation(fields: [postId], references: [id])
  category   Category @relation(fields: [categoryId], references: [id])

  @@unique([postId, categoryId]) // Prevent duplicates
}
```

**Creating:**

```typescript
// Create post with categories
await prisma.post.create({
  data: {
    title: 'My Post',
    categories: {
      create: [
        { category: { connect: { id: 1 } } },
        { category: { connect: { id: 2 } } },
      ],
    },
  },
});
```

**Querying:**

```typescript
// Get post with categories
await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    categories: {
      include: { category: true },
    },
  },
});
```

## 🛠️ Useful Commands

### Docker Commands

```bash
npm run docker:up      # Start PostgreSQL container
npm run docker:down    # Stop and remove container
npm run docker:logs    # View container logs
```

### Prisma Commands

```bash
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create and apply migration
npm run prisma:studio    # Open Prisma Studio (GUI)
npm run prisma:seed      # Seed database with sample data
npm run prisma:reset     # Reset database (delete all data)
```

### NestJS Commands

```bash
npm run start:dev      # Start in development mode
npm run start:prod     # Start in production mode
npm run build          # Build the project
npm run lint           # Run linter
```

### All-in-One Setup

```bash
npm run setup          # Start Docker + Migrate + Generate
```

## 🎓 Learning Path

1. **Start with the Schema** (`prisma/schema.prisma`)
   - Study the model definitions
   - Understand relationship syntax
   - Note the `@relation`, `@unique`, and cascade options

2. **Explore the Services** (`src/*/**.service.ts`)
   - See how to create entities with relationships
   - Learn about `include` for querying relationships
   - Understand `connect`, `create`, and nested operations

3. **Test the API** (using curl, Postman, or Thunder Client)
   - Create users with profiles
   - Add posts with categories
   - Create comments
   - Query nested relationships

4. **Use Prisma Studio**

   ```bash
   npm run prisma:studio
   ```

   - Visual interface to explore data
   - See relationships in action
   - Edit data directly

5. **Read the Seed Script** (`prisma/seed.ts`)
   - See complete examples of relationship creation
   - Understand data dependencies

## 🔐 Database Connection

The application uses PostgreSQL via Docker. Connection details:

- **Host:** localhost
- **Port:** 5432
- **Database:** prisma_learn_db
- **User:** prisma_user
- **Password:** prisma_password

Connection string (in `.env`):

```
DATABASE_URL="postgresql://prisma_user:prisma_password@localhost:5432/prisma_learn_db?schema=public"
```

## 📊 Prisma Studio

Prisma Studio is a visual database browser. Launch it with:

```bash
npm run prisma:studio
```

Then open http://localhost:5555 to:

- Browse all tables
- View relationships visually
- Edit records
- Run queries

## 🐛 Troubleshooting

### Docker Issues

**Problem:** Cannot connect to Docker daemon

```bash
# Solution: Start Docker Desktop
open -a Docker  # macOS
```

**Problem:** Port 5432 already in use

```bash
# Solution: Stop existing PostgreSQL
brew services stop postgresql  # macOS
# Or change port in docker-compose.yml
```

### Prisma Issues

**Problem:** Prisma Client not generated

```bash
# Solution: Generate the client
npm run prisma:generate
```

**Problem:** Migration fails

```bash
# Solution: Reset database
npm run prisma:reset
```

### Application Issues

**Problem:** Module not found errors

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Database Relationships Guide](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

## 🎯 Practice Exercises

1. **Add a new relationship:**
   - Add a `Tag` model with MANY-TO-MANY relationship to posts
2. **Implement soft delete:**
   - Add `deletedAt` field to models
   - Implement soft delete logic

3. **Add pagination:**
   - Implement pagination for list endpoints
   - Use Prisma's `skip` and `take`

4. **Add search:**
   - Implement full-text search
   - Use Prisma's `contains` and `search`

5. **Add validation:**
   - Use class-validator for DTOs
   - Add custom validation rules

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

## 🤝 Contributing

This is a learning project. Feel free to:

- Add more examples
- Improve documentation
- Fix bugs
- Add new features

---

Happy Learning! 🚀

If you have questions, create an issue or refer to the Prisma documentation.
