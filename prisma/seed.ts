import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * SEED SCRIPT
 * 
 * This script populates the database with sample data
 * to demonstrate all types of relationships.
 * 
 * Run with: npm run prisma:seed
 */
async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.comment.deleteMany();
  await prisma.postCategory.deleteMany();
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Data cleaned\n');

  // Create Categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Technology', slug: 'technology' },
    }),
    prisma.category.create({
      data: { name: 'Programming', slug: 'programming' },
    }),
    prisma.category.create({
      data: { name: 'Web Development', slug: 'web-development' },
    }),
    prisma.category.create({
      data: { name: 'Database', slug: 'database' },
    }),
    prisma.category.create({
      data: { name: 'Tutorial', slug: 'tutorial' },
    }),
  ]);
  console.log(`✅ Created ${categories.length} categories\n`);

  // Create Users with Profiles (ONE-TO-ONE)
  console.log('👤 Creating users with profiles...');
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      profile: {
        create: {
          bio: 'Full-stack developer passionate about TypeScript and Node.js',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          website: 'https://johndoe.dev',
        },
      },
    },
    include: { profile: true },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      profile: {
        create: {
          bio: 'Backend engineer and database enthusiast',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
          website: 'https://janesmith.dev',
        },
      },
    },
    include: { profile: true },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Johnson',
      // No profile - demonstrating optional ONE-TO-ONE relationship
    },
  });

  console.log(`✅ Created 3 users with profiles\n`);

  // Create Posts (ONE-TO-MANY with Users)
  console.log('📝 Creating posts...');
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Prisma ORM',
      content:
        'Prisma is a modern database toolkit that makes database access easy with an auto-generated query builder for TypeScript & Node.js.',
      published: true,
      authorId: user1.id,
      // MANY-TO-MANY: Connect to categories
      categories: {
        create: [
          { category: { connect: { id: categories[1].id } } }, // Programming
          { category: { connect: { id: categories[3].id } } }, // Database
          { category: { connect: { id: categories[4].id } } }, // Tutorial
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Understanding Database Relationships',
      content:
        'Learn about one-to-one, one-to-many, and many-to-many relationships in relational databases.',
      published: true,
      authorId: user2.id,
      categories: {
        create: [
          { category: { connect: { id: categories[3].id } } }, // Database
          { category: { connect: { id: categories[4].id } } }, // Tutorial
        ],
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Building REST APIs with NestJS',
      content:
        'NestJS is a progressive Node.js framework for building efficient and scalable server-side applications.',
      published: true,
      authorId: user1.id,
      categories: {
        create: [
          { category: { connect: { id: categories[1].id } } }, // Programming
          { category: { connect: { id: categories[2].id } } }, // Web Development
          { category: { connect: { id: categories[4].id } } }, // Tutorial
        ],
      },
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Draft: Advanced TypeScript Patterns',
      content: 'This is a draft post about advanced TypeScript patterns...',
      published: false, // Draft post
      authorId: user2.id,
      categories: {
        create: [{ category: { connect: { id: categories[1].id } } }], // Programming
      },
    },
  });

  console.log(`✅ Created 4 posts\n`);

  // Create Comments (ONE-TO-MANY with Posts and Users)
  console.log('💬 Creating comments...');
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great tutorial! Very helpful for beginners.',
        postId: post1.id,
        authorId: user2.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Thanks for sharing this. Looking forward to more content!',
        postId: post1.id,
        authorId: user3.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Clear explanation of database relationships. Well done!',
        postId: post2.id,
        authorId: user1.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'NestJS is indeed powerful. Great article!',
        postId: post3.id,
        authorId: user2.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'I learned a lot from this post. Thank you!',
        postId: post3.id,
        authorId: user3.id,
      },
    }),
  ]);

  console.log(`✅ Created ${comments.length} comments\n`);

  // Print summary
  console.log('📊 Database Seed Summary:');
  console.log('========================');
  console.log(`👤 Users: 3`);
  console.log(`📇 Profiles: 2 (demonstrating optional ONE-TO-ONE)`);
  console.log(`📝 Posts: 4 (3 published, 1 draft)`);
  console.log(`📂 Categories: 5`);
  console.log(`🔗 Post-Category Relations: 9 (MANY-TO-MANY)`);
  console.log(`💬 Comments: ${comments.length}`);
  console.log('\n✨ Database seed completed successfully!\n');
  console.log('🎯 Try these commands:');
  console.log('  - npm run start:dev          # Start the application');
  console.log('  - npm run prisma:studio      # Open Prisma Studio to view data');
  console.log('\n📖 API Endpoints to try:');
  console.log('  - GET  http://localhost:3000/users');
  console.log('  - GET  http://localhost:3000/users/1');
  console.log('  - GET  http://localhost:3000/posts?includeRelations=true');
  console.log('  - GET  http://localhost:3000/posts/1');
  console.log('  - GET  http://localhost:3000/categories');
  console.log('  - GET  http://localhost:3000/comments/by-post/1');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

