import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';

/**
 * POSTS CONTROLLER
 * 
 * Demonstrates REST API endpoints for working with:
 * - ONE-TO-MANY relationships (Post -> User, Post -> Comments)
 * - MANY-TO-MANY relationships (Post <-> Categories)
 */
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * POST /posts
   * Create a new post
   * 
   * Example body:
   * {
   *   "title": "My First Post",
   *   "content": "This is the content of my post",
   *   "published": true,
   *   "authorId": 1
   * }
   */
  @Post()
  create(
    @Body()
    createPostDto: {
      title: string;
      content?: string;
      published?: boolean;
      authorId: number;
    },
  ) {
    return this.postsService.create(createPostDto);
  }

  /**
   * POST /posts/with-categories
   * Create a post with categories (MANY-TO-MANY)
   * 
   * Example body:
   * {
   *   "title": "Learning Prisma",
   *   "content": "Prisma is awesome!",
   *   "published": true,
   *   "authorId": 1,
   *   "categoryIds": [1, 2, 3]
   * }
   */
  @Post('with-categories')
  createWithCategories(
    @Body()
    createPostDto: {
      title: string;
      content?: string;
      published?: boolean;
      authorId: number;
      categoryIds: number[];
    },
  ) {
    return this.postsService.createWithCategories(createPostDto);
  }

  /**
   * GET /posts?published=true&authorId=1&includeRelations=true
   * Get all posts with optional filters
   */
  @Get()
  findAll(
    @Query('published') published?: string,
    @Query('authorId') authorId?: string,
    @Query('includeRelations') includeRelations?: string,
  ) {
    return this.postsService.findAll({
      published: published === 'true' ? true : published === 'false' ? false : undefined,
      authorId: authorId ? parseInt(authorId) : undefined,
      includeRelations: includeRelations === 'true',
    });
  }

  /**
   * GET /posts/by-category/:categoryId
   * Get all posts in a category (MANY-TO-MANY)
   */
  @Get('by-category/:categoryId')
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.postsService.findByCategory(categoryId);
  }

  /**
   * GET /posts/:id
   * Get a single post with all relationships
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  /**
   * GET /posts/:id/stats
   * Get post statistics
   */
  @Get(':id/stats')
  getPostStats(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostStats(id);
  }

  /**
   * PATCH /posts/:id
   * Update a post
   * 
   * Example body:
   * {
   *   "title": "Updated Title",
   *   "published": true
   * }
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updatePostDto: {
      title?: string;
      content?: string;
      published?: boolean;
    },
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  /**
   * POST /posts/:id/categories
   * Add categories to a post (MANY-TO-MANY)
   * 
   * Example body:
   * {
   *   "categoryIds": [2, 3]
   * }
   */
  @Post(':id/categories')
  addCategories(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { categoryIds: number[] },
  ) {
    return this.postsService.addCategories(id, body.categoryIds);
  }

  /**
   * DELETE /posts/:id/categories/:categoryId
   * Remove a category from a post (MANY-TO-MANY)
   */
  @Delete(':id/categories/:categoryId')
  removeCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.postsService.removeCategory(id, categoryId);
  }

  /**
   * POST /posts/:id/comments
   * Add a comment to a post (ONE-TO-MANY)
   * 
   * Example body:
   * {
   *   "content": "Great post!",
   *   "authorId": 1
   * }
   */
  @Post(':id/comments')
  addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { content: string; authorId: number },
  ) {
    return this.postsService.addComment(id, body);
  }

  /**
   * DELETE /posts/:id
   * Delete a post (CASCADE: also deletes comments and category relationships)
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}

