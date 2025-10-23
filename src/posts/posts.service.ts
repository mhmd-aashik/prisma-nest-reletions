import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * POSTS SERVICE
 * 
 * Demonstrates:
 * - ONE-TO-MANY: Post belongs to User
 * - MANY-TO-MANY: Post has many Categories
 * - ONE-TO-MANY: Post has many Comments
 */
@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREATE A POST
   * Demonstrates ONE-TO-MANY relationship (Post belongs to User)
   */
  async create(data: {
    title: string;
    content?: string;
    published?: boolean;
    authorId: number;
  }) {
    return this.prisma.post.create({
      data,
      include: {
        author: true, // Include the related user
      },
    });
  }

  /**
   * CREATE POST WITH CATEGORIES (MANY-TO-MANY)
   * This shows how to create a post and connect it to existing categories
   */
  async createWithCategories(data: {
    title: string;
    content?: string;
    published?: boolean;
    authorId: number;
    categoryIds: number[]; // Array of category IDs to connect
  }) {
    const { categoryIds, ...postData } = data;

    return this.prisma.post.create({
      data: {
        ...postData,
        // Connect to existing categories using the join table
        categories: {
          create: categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  /**
   * FIND ALL POSTS
   * With optional filters and relationships
   */
  async findAll(filters?: {
    published?: boolean;
    authorId?: number;
    includeRelations?: boolean;
  }) {
    return this.prisma.post.findMany({
      where: {
        published: filters?.published,
        authorId: filters?.authorId,
      },
      include: filters?.includeRelations
        ? {
            author: true, // Include ONE-TO-MANY (author)
            categories: {
              // Include MANY-TO-MANY (categories)
              include: {
                category: true,
              },
            },
            comments: {
              // Include ONE-TO-MANY (comments)
              include: {
                author: true, // Nested include: comment's author
              },
            },
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * FIND ONE POST
   * With all relationships included
   */
  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            profile: true, // Nested include: author's profile
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  /**
   * UPDATE POST
   */
  async update(
    id: number,
    data: {
      title?: string;
      content?: string;
      published?: boolean;
    },
  ) {
    return this.prisma.post.update({
      where: { id },
      data,
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  /**
   * ADD CATEGORIES TO POST (MANY-TO-MANY)
   * Demonstrates adding relationships to existing entities
   */
  async addCategories(postId: number, categoryIds: number[]) {
    // First check if post exists
    await this.findOne(postId);

    // Create connections for each category
    await this.prisma.postCategory.createMany({
      data: categoryIds.map((categoryId) => ({
        postId,
        categoryId,
      })),
      skipDuplicates: true, // Skip if relationship already exists
    });

    return this.findOne(postId);
  }

  /**
   * REMOVE CATEGORY FROM POST (MANY-TO-MANY)
   * Demonstrates removing relationships
   */
  async removeCategory(postId: number, categoryId: number) {
    await this.prisma.postCategory.deleteMany({
      where: {
        postId,
        categoryId,
      },
    });

    return this.findOne(postId);
  }

  /**
   * ADD COMMENT TO POST (ONE-TO-MANY)
   */
  async addComment(postId: number, data: { content: string; authorId: number }) {
    // Verify post exists
    await this.findOne(postId);

    return this.prisma.comment.create({
      data: {
        content: data.content,
        postId,
        authorId: data.authorId,
      },
      include: {
        author: true,
        post: true,
      },
    });
  }

  /**
   * DELETE POST
   * CASCADE: Also deletes related comments and post-category relationships
   */
  async remove(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  /**
   * GET POSTS BY CATEGORY (MANY-TO-MANY)
   * Demonstrates querying through many-to-many relationships
   */
  async findByCategory(categoryId: number) {
    return this.prisma.post.findMany({
      where: {
        categories: {
          some: {
            categoryId,
          },
        },
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  /**
   * GET POST STATISTICS
   */
  async getPostStats(postId: number) {
    const post = await this.findOne(postId);

    return {
      post: {
        id: post.id,
        title: post.title,
        published: post.published,
      },
      stats: {
        totalComments: post.comments.length,
        totalCategories: post.categories.length,
        author: post.author.name || post.author.email,
      },
    };
  }
}

