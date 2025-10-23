import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';

/**
 * ROOT APPLICATION MODULE
 *
 * This module imports all feature modules and the Prisma module.
 * PrismaModule is @Global(), so it's available everywhere without re-importing.
 */
@Module({
  imports: [
    PrismaModule, // Database module (global)
    UsersModule, // Users & Profiles (ONE-TO-ONE)
    PostsModule, // Posts with relationships
    CategoriesModule, // Categories (MANY-TO-MANY with Posts)
    CommentsModule, // Comments (ONE-TO-MANY with Posts & Users)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
