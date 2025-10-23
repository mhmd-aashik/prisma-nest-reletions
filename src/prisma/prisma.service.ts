import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PRISMA SERVICE
 * 
 * This service extends PrismaClient and integrates with NestJS lifecycle.
 * It handles the database connection and provides access to all Prisma models.
 * 
 * Key concepts:
 * - OnModuleInit: Connects to database when NestJS module is initialized
 * - OnModuleDestroy: Disconnects when the module is destroyed
 * - Injectable: Makes it available for dependency injection
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'], // Enable logging for learning purposes
    });
  }

  /**
   * Connect to database when module initializes
   */
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected successfully');
  }

  /**
   * Disconnect from database when module is destroyed
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Database disconnected');
  }

  /**
   * Clean database (useful for testing)
   * This will delete all records from all tables
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production!');
    }

    // Delete in order to respect foreign key constraints
    await this.comment.deleteMany();
    await this.postCategory.deleteMany();
    await this.post.deleteMany();
    await this.profile.deleteMany();
    await this.category.deleteMany();
    await this.user.deleteMany();
  }
}

