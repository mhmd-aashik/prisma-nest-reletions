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
import { CategoriesService } from './categories.service';

/**
 * CATEGORIES CONTROLLER
 * 
 * Demonstrates MANY-TO-MANY relationship with Posts
 */
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * POST /categories
   * Create a new category
   * 
   * Example body:
   * {
   *   "name": "Technology",
   *   "slug": "technology"
   * }
   */
  @Post()
  create(@Body() createCategoryDto: { name: string; slug: string }) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * GET /categories?includePosts=true
   * Get all categories (optionally with posts)
   */
  @Get()
  findAll(@Query('includePosts') includePosts?: string) {
    return this.categoriesService.findAll(includePosts === 'true');
  }

  /**
   * GET /categories/popular?limit=5
   * Get popular categories (with most posts)
   */
  @Get('popular')
  getPopularCategories(@Query('limit') limit?: string) {
    return this.categoriesService.getPopularCategories(
      limit ? parseInt(limit) : undefined,
    );
  }

  /**
   * GET /categories/slug/:slug
   * Get category by slug
   */
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  /**
   * GET /categories/:id
   * Get a single category with all posts
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  /**
   * GET /categories/:id/stats
   * Get category statistics
   */
  @Get(':id/stats')
  getCategoryStats(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getCategoryStats(id);
  }

  /**
   * PATCH /categories/:id
   * Update a category
   * 
   * Example body:
   * {
   *   "name": "Updated Technology",
   *   "slug": "updated-technology"
   * }
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: { name?: string; slug?: string },
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * DELETE /categories/:id
   * Delete a category (removes all post-category relationships)
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}

