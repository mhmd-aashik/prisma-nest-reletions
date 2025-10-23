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
import {
  CreateUserDto,
  CreateUserWithProfileDto,
  UpdateUserDto,
  UpdateProfileDto,
} from './dto';

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
   * 
   * Now with DTO validation:
   * - Email is validated (must be valid email format)
   * - Name is optional but must be at least 2 characters
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
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
   *     "bio": "Software Developer with 5+ years experience",
   *     "avatar": "https://example.com/avatar.jpg",
   *     "website": "https://janedoe.com"
   *   }
   * }
   * 
   * Now with DTO validation:
   * - Email must be valid
   * - Profile.bio must be at least 10 characters
   * - Avatar and website must be valid URLs
   * - Nested validation with @ValidateNested
   */
  @Post('with-profile')
  createWithProfile(@Body() createUserDto: CreateUserWithProfileDto) {
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
   * 
   * Now with DTO validation:
   * - All fields are optional (PartialType)
   * - If email is provided, it must be valid
   * - If name is provided, it must be at least 2 characters
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * PATCH /users/:id/profile
   * Update user's profile (ONE-TO-ONE relationship)
   * 
   * Example body:
   * {
   *   "bio": "Updated bio with at least 10 characters",
   *   "website": "https://newwebsite.com"
   * }
   * 
   * Now with DTO validation:
   * - Bio must be at least 10 characters if provided
   * - Avatar and website must be valid URLs if provided
   */
  @Patch(':id/profile')
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
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

