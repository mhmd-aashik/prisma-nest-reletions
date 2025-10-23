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
import { UsersService } from './users.service';

/**
 * USERS CONTROLLER
 * 
 * This controller exposes REST API endpoints for user operations.
 * Each endpoint demonstrates different relationship operations.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Create a new user
   * 
   * Example body:
   * {
   *   "email": "john@example.com",
   *   "name": "John Doe"
   * }
   */
  @Post()
  create(@Body() createUserDto: { email: string; name?: string }) {
    return this.usersService.create(createUserDto);
  }

  /**
   * POST /users/with-profile
   * Create a user with profile (ONE-TO-ONE relationship)
   * 
   * Example body:
   * {
   *   "email": "jane@example.com",
   *   "name": "Jane Doe",
   *   "profile": {
   *     "bio": "Software Developer",
   *     "avatar": "https://example.com/avatar.jpg",
   *     "website": "https://janedoe.com"
   *   }
   * }
   */
  @Post('with-profile')
  createWithProfile(
    @Body()
    createUserDto: {
      email: string;
      name?: string;
      profile: {
        bio?: string;
        avatar?: string;
        website?: string;
      };
    },
  ) {
    return this.usersService.createWithProfile(createUserDto);
  }

  /**
   * GET /users?includeRelations=true
   * Get all users (optionally with relationships)
   */
  @Get()
  findAll(@Query('includeRelations') includeRelations?: string) {
    return this.usersService.findAll(includeRelations === 'true');
  }

  /**
   * GET /users/:id
   * Get a single user with all relationships
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  /**
   * GET /users/:id/stats
   * Get user statistics (posts count, comments count, etc.)
   */
  @Get(':id/stats')
  getUserStats(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserStats(id);
  }

  /**
   * PATCH /users/:id
   * Update a user
   * 
   * Example body:
   * {
   *   "name": "John Smith"
   * }
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: { email?: string; name?: string },
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * PATCH /users/:id/profile
   * Update user's profile (ONE-TO-ONE relationship)
   * 
   * Example body:
   * {
   *   "bio": "Updated bio",
   *   "website": "https://newwebsite.com"
   * }
   */
  @Patch(':id/profile')
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: { bio?: string; avatar?: string; website?: string },
  ) {
    return this.usersService.updateProfile(id, updateProfileDto);
  }

  /**
   * DELETE /users/:id
   * Delete a user (CASCADE: also deletes profile, posts, comments)
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}

