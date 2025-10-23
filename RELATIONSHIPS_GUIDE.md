# 🔗 Prisma Database Relationships - Complete Guide

This guide explains all types of database relationships in Prisma with practical examples from this project.

## Table of Contents
1. [ONE-TO-ONE Relationships](#one-to-one-relationships)
2. [ONE-TO-MANY Relationships](#one-to-many-relationships)
3. [MANY-TO-MANY Relationships](#many-to-many-relationships)
4. [Advanced Querying](#advanced-querying)
5. [Cascade Operations](#cascade-operations)

---

## ONE-TO-ONE Relationships

### 📝 Definition
A ONE-TO-ONE relationship means each record in Table A relates to exactly one record in Table B, and vice versa.

### 🎯 Example: User ↔ Profile

**Business Logic:** Each user has one profile, and each profile belongs to one user.

### Schema Definition

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile? // ? makes it optional
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  userId Int    @unique  // @unique ensures one-to-one
  user   User   @relation(fields: [userId], references: [id])
}
```

**Key Points:**
- `userId Int @unique` - The `@unique` constraint ensures one profile per user
- `profile Profile?` - The `?` makes it optional (user can exist without profile)
- `@relation(fields: [userId], references: [id])` - Defines the relationship

### Create Operations

**1. Create User with Profile (Nested Create)**
```typescript
const user = await prisma.user.create({
  data: {
    email: "john@example.com",
    name: "John Doe",
    profile: {
      create: {
        bio: "Software Developer",
        avatar: "avatar.jpg",
        website: "https://john.dev"
      }
    }
  },
  include: {
    profile: true  // Include profile in response
  }
});
```

**2. Create User First, Then Profile**
```typescript
// Step 1: Create user
const user = await prisma.user.create({
  data: {
    email: "jane@example.com",
    name: "Jane Doe"
  }
});

// Step 2: Create profile for user
const profile = await prisma.profile.create({
  data: {
    bio: "Data Scientist",
    userId: user.id  // Link to user
  }
});
```

### Read Operations

**Get User with Profile:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { profile: true }
});
```

**Get Profile with User:**
```typescript
const profile = await prisma.profile.findUnique({
  where: { userId: 1 },
  include: { user: true }
});
```

### Update Operations

**Update or Create Profile:**
```typescript
// If profile exists, update it; otherwise create it
const profile = await prisma.profile.upsert({
  where: { userId: 1 },
  update: {
    bio: "Updated bio"
  },
  create: {
    bio: "New bio",
    userId: 1
  }
});
```

### Delete Operations

**Delete with Cascade:**
```typescript
// Deleting user also deletes profile (due to onDelete: Cascade)
await prisma.user.delete({
  where: { id: 1 }
});
```

---

## ONE-TO-MANY Relationships

### 📝 Definition
A ONE-TO-MANY relationship means each record in Table A can relate to multiple records in Table B, but each record in Table B relates to only one record in Table A.

### 🎯 Example: User → Posts

**Business Logic:** A user can write many posts, but each post has one author.

### Schema Definition

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[] // Array indicates ONE-TO-MANY
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int    // Foreign key
  author   User   @relation(fields: [authorId], references: [id])
}
```

**Key Points:**
- `posts Post[]` - The `[]` indicates multiple posts
- `authorId Int` - Foreign key pointing to User
- No `@unique` on `authorId` (unlike ONE-TO-ONE) - multiple posts can have same author

### Create Operations

**1. Create Post for Existing User**
```typescript
const post = await prisma.post.create({
  data: {
    title: "My First Post",
    content: "Hello World",
    authorId: 1  // Link to existing user
  },
  include: {
    author: true  // Include author in response
  }
});
```

**2. Create User with Multiple Posts (Nested Create)**
```typescript
const user = await prisma.user.create({
  data: {
    email: "bob@example.com",
    name: "Bob",
    posts: {
      create: [
        { title: "Post 1", content: "Content 1" },
        { title: "Post 2", content: "Content 2" },
        { title: "Post 3", content: "Content 3" }
      ]
    }
  },
  include: {
    posts: true
  }
});
```

**3. Connect Existing Post to User**
```typescript
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      connect: { id: 5 }  // Connect existing post
    }
  }
});
```

### Read Operations

**Get User with All Posts:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      orderBy: {
        createdAt: 'desc'
      }
    }
  }
});
```

**Get Posts with Filtering:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: {
        published: true  // Only published posts
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10  // Limit to 10 posts
    }
  }
});
```

**Count Related Records:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    _count: {
      select: {
        posts: true  // Count posts
      }
    }
  }
});
// Result: { ..., _count: { posts: 5 } }
```

### Update Operations

**Add Posts to User:**
```typescript
await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      create: [
        { title: "New Post 1" },
        { title: "New Post 2" }
      ]
    }
  }
});
```

### Delete Operations

**Delete Parent (Cascade to Children):**
```typescript
// Deletes user and all their posts (if onDelete: Cascade)
await prisma.user.delete({
  where: { id: 1 }
});
```

**Delete All Related Records:**
```typescript
// Delete all posts by a user
await prisma.post.deleteMany({
  where: {
    authorId: 1
  }
});
```

---

## MANY-TO-MANY Relationships

### 📝 Definition
A MANY-TO-MANY relationship means each record in Table A can relate to multiple records in Table B, and each record in Table B can relate to multiple records in Table A.

### 🎯 Example: Posts ↔ Categories

**Business Logic:** A post can have many categories, and a category can be assigned to many posts.

### Schema Definition

Prisma supports two types of MANY-TO-MANY:

#### 1. Implicit (Prisma generates join table)
```prisma
model Post {
  id         Int        @id @default(autoincrement())
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
```

#### 2. Explicit (You control the join table) ⭐ Used in this project
```prisma
model Post {
  id         Int            @id @default(autoincrement())
  categories PostCategory[] // Through join table
}

model Category {
  id    Int            @id @default(autoincrement())
  posts PostCategory[] // Through join table
}

model PostCategory {
  id         Int      @id @default(autoincrement())
  postId     Int
  categoryId Int
  createdAt  DateTime @default(now())  // Extra field!
  
  post     Post     @relation(fields: [postId], references: [id])
  category Category @relation(fields: [categoryId], references: [id])
  
  @@unique([postId, categoryId])  // Prevent duplicates
}
```

**Why Explicit?**
- Can store additional data (like `createdAt`)
- More control over the relationship
- Can query the relationship itself

### Create Operations

**1. Create Post with Categories (Nested Create)**
```typescript
const post = await prisma.post.create({
  data: {
    title: "Learning Prisma",
    content: "Prisma is great!",
    authorId: 1,
    categories: {
      create: [
        {
          category: {
            connect: { id: 1 }  // Connect to existing category
          }
        },
        {
          category: {
            connect: { id: 2 }
          }
        },
        {
          category: {
            create: {  // Or create new category
              name: "New Category",
              slug: "new-category"
            }
          }
        }
      ]
    }
  },
  include: {
    categories: {
      include: {
        category: true
      }
    }
  }
});
```

**2. Add Categories to Existing Post**
```typescript
// Add single category
await prisma.postCategory.create({
  data: {
    postId: 1,
    categoryId: 3
  }
});

// Add multiple categories
await prisma.postCategory.createMany({
  data: [
    { postId: 1, categoryId: 4 },
    { postId: 1, categoryId: 5 }
  ],
  skipDuplicates: true  // Skip if already exists
});
```

**3. Create Category with Posts**
```typescript
const category = await prisma.category.create({
  data: {
    name: "Technology",
    slug: "technology",
    posts: {
      create: [
        {
          post: {
            connect: { id: 1 }
          }
        },
        {
          post: {
            connect: { id: 2 }
          }
        }
      ]
    }
  }
});
```

### Read Operations

**Get Post with Categories:**
```typescript
const post = await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    categories: {
      include: {
        category: true  // Include category details
      }
    }
  }
});

// Result structure:
// {
//   id: 1,
//   title: "...",
//   categories: [
//     {
//       id: 1,
//       postId: 1,
//       categoryId: 1,
//       category: {
//         id: 1,
//         name: "Technology",
//         slug: "technology"
//       }
//     },
//     ...
//   ]
// }
```

**Get Category with Posts:**
```typescript
const category = await prisma.category.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      include: {
        post: {
          include: {
            author: true  // Nested include!
          }
        }
      }
    }
  }
});
```

**Find Posts by Category:**
```typescript
const posts = await prisma.post.findMany({
  where: {
    categories: {
      some: {  // At least one matching category
        categoryId: 1
      }
    }
  },
  include: {
    author: true,
    categories: {
      include: {
        category: true
      }
    }
  }
});
```

**Find Posts with Multiple Categories (AND):**
```typescript
const posts = await prisma.post.findMany({
  where: {
    AND: [
      {
        categories: {
          some: { categoryId: 1 }
        }
      },
      {
        categories: {
          some: { categoryId: 2 }
        }
      }
    ]
  }
});
```

### Update Operations

**Replace All Categories:**
```typescript
await prisma.post.update({
  where: { id: 1 },
  data: {
    categories: {
      deleteMany: {},  // Remove all existing
      create: [  // Add new ones
        { category: { connect: { id: 3 } } },
        { category: { connect: { id: 4 } } }
      ]
    }
  }
});
```

### Delete Operations

**Remove Category from Post:**
```typescript
await prisma.postCategory.deleteMany({
  where: {
    postId: 1,
    categoryId: 2
  }
});
```

**Remove All Categories from Post:**
```typescript
await prisma.postCategory.deleteMany({
  where: {
    postId: 1
  }
});
```

**Delete Post (Cascade removes relationships):**
```typescript
// Automatically removes all PostCategory records
await prisma.post.delete({
  where: { id: 1 }
});
```

---

## Advanced Querying

### Nested Includes

Get deeply nested relationships:
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    profile: true,
    posts: {
      include: {
        categories: {
          include: {
            category: true
          }
        },
        comments: {
          include: {
            author: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    }
  }
});
```

### Select Specific Fields

Instead of including everything, select only what you need:
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    email: true,
    posts: {
      select: {
        id: true,
        title: true,
        categories: {
          select: {
            category: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }
  }
});
```

### Filtering Related Records

```typescript
// Get users who have at least one published post
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: true
      }
    }
  }
});

// Get users who have NO posts
const users = await prisma.user.findMany({
  where: {
    posts: {
      none: {}
    }
  }
});

// Get users where ALL posts are published
const users = await prisma.user.findMany({
  where: {
    posts: {
      every: {
        published: true
      }
    }
  }
});
```

### Counting Related Records

```typescript
const users = await prisma.user.findMany({
  include: {
    _count: {
      select: {
        posts: true,
        comments: true
      }
    }
  }
});
// Result: { ..., _count: { posts: 5, comments: 10 } }
```

### Aggregations

```typescript
// Count posts per category
const categories = await prisma.category.findMany({
  include: {
    _count: {
      select: {
        posts: true
      }
    }
  },
  orderBy: {
    posts: {
      _count: 'desc'
    }
  }
});
```

---

## Cascade Operations

### onDelete Behaviors

Prisma supports different cascade behaviors:

```prisma
model Profile {
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  //                                                       ^^^^^^^^^^^^^^^
}
```

**Available options:**
- `Cascade` - Delete child when parent is deleted
- `SetNull` - Set foreign key to NULL (field must be optional)
- `Restrict` - Prevent deletion if children exist
- `NoAction` - Similar to Restrict
- `SetDefault` - Set to default value

### Example Scenarios

**1. Cascade Delete:**
```prisma
model User {
  posts Post[]
}

model Post {
  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```
Deleting user → Deletes all their posts

**2. Set Null:**
```prisma
model Post {
  authorId Int?  // Must be optional
  author   User? @relation(fields: [authorId], references: [id], onDelete: SetNull)
}
```
Deleting user → Sets `authorId` to NULL in posts

**3. Restrict:**
```prisma
model Post {
  author User @relation(fields: [authorId], references: [id], onDelete: Restrict)
}
```
Deleting user → Error if they have posts

---

## Best Practices

### 1. Use Transactions for Complex Operations
```typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: "test@example.com" }
  });
  
  const post = await tx.post.create({
    data: {
      title: "First Post",
      authorId: user.id
    }
  });
  
  return { user, post };
});
```

### 2. Use `include` vs `select` Wisely
- Use `include` when you want the base object + relationships
- Use `select` when you want specific fields only

### 3. Avoid N+1 Queries
```typescript
// ❌ BAD: N+1 query
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({
    where: { authorId: user.id }
  });
}

// ✅ GOOD: Single query with include
const users = await prisma.user.findMany({
  include: {
    posts: true
  }
});
```

### 4. Use Proper Indexes
```prisma
model Post {
  authorId Int
  
  @@index([authorId])  // Index for faster queries
}
```

---

## Practice Exercises

Try these to test your understanding:

1. Create a user with a profile and 3 posts in a single operation
2. Query all posts in "Technology" category with author profiles
3. Find users who have commented on posts they didn't write
4. Get the top 5 categories by post count
5. Update a post to have different categories without deleting the post

Refer to the service files in `src/` for implementation examples!

---

Happy Learning! 🚀

