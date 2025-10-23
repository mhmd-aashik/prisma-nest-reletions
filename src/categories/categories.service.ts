import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * CATEGORIES SERVICE
 * 
 * Demonstrates MANY-TO-MANY relationship with Posts
 */
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREATE A CATEGORY
   */
  async create(data: { name: string; slug: string }) {
    try {
      return await this.prisma.category.create({
        data,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Category with this name or slug already exists');
      }
      throw error;
    }
  }

  /**
   * FIND ALL CATEGORIES
   * Optionally include related posts
   */
  async findAll(includePosts = false) {
    return this.prisma.category.findMany({
      include: includePosts
        ? {
            posts: {
              include: {
                post: {
                  include: {
                    author: true,
                  },
                },
              },
            },
          }
        : undefined,
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * FIND ONE CATEGORY
   * With all related posts
   */
  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            post: {
              include: {
                author: true,
                comments: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * FIND BY SLUG
   */
  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        posts: {
          include: {
            post: {
              include: {
                author: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }

    return category;
  }

  /**
   * UPDATE CATEGORY
   */
  async update(id: number, data: { name?: string; slug?: string }) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Category with this name or slug already exists');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * DELETE CATEGORY
   * CASCADE: Also removes all post-category relationships
   */
  async remove(id: number) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * GET CATEGORY STATISTICS
   */
  async getCategoryStats(id: number) {
    const category = await this.findOne(id);

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
      stats: {
        totalPosts: category.posts.length,
      },
    };
  }

  /**
   * GET POPULAR CATEGORIES
   * Categories with the most posts
   */
  async getPopularCategories(limit = 10) {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return categories;
  }
}

