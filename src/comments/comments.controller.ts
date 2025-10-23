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
import { CommentsService } from './comments.service';

/**
 * COMMENTS CONTROLLER
 * 
 * Demonstrates entity with multiple ONE-TO-MANY relationships
 */
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * POST /comments
   * Create a new comment
   * 
   * Example body:
   * {
   *   "content": "Great post!",
   *   "postId": 1,
   *   "authorId": 1
   * }
   */
  @Post()
  create(
    @Body()
    createCommentDto: {
      content: string;
      postId: number;
      authorId: number;
    },
  ) {
    return this.commentsService.create(createCommentDto);
  }

  /**
   * GET /comments?postId=1&authorId=1
   * Get all comments with optional filters
   */
  @Get()
  findAll(
    @Query('postId') postId?: string,
    @Query('authorId') authorId?: string,
  ) {
    return this.commentsService.findAll({
      postId: postId ? parseInt(postId) : undefined,
      authorId: authorId ? parseInt(authorId) : undefined,
    });
  }

  /**
   * GET /comments/by-post/:postId
   * Get all comments for a specific post
   */
  @Get('by-post/:postId')
  findByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.findByPost(postId);
  }

  /**
   * GET /comments/by-user/:userId
   * Get all comments by a specific user
   */
  @Get('by-user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.commentsService.findByUser(userId);
  }

  /**
   * GET /comments/:id
   * Get a single comment
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  /**
   * PATCH /comments/:id
   * Update a comment
   * 
   * Example body:
   * {
   *   "content": "Updated comment content"
   * }
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: { content: string },
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  /**
   * DELETE /comments/:id
   * Delete a comment
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}

