import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * COMMENTS SERVICE
 * 
 * Demonstrates:
 * - ONE-TO-MANY: Comment belongs to Post
 * - ONE-TO-MANY: Comment belongs to User (author)
 */
@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREATE A COMMENT
   * Demonstrates creating an entity with multiple foreign keys
   */
  async create(data: { content: string; postId: number; authorId: number }) {
    return this.prisma.comment.create({
      data,
      include: {
        author: true,
        post: {
          include: {
            author: true,
          },
        },
      },
    });
  }

  /**
   * FIND ALL COMMENTS
   * With optional filters
   */
  async findAll(filters?: { postId?: number; authorId?: number }) {
    return this.prisma.comment.findMany({
      where: {
        postId: filters?.postId,
        authorId: filters?.authorId,
      },
      include: {
        author: true,
        post: {
          include: {
            author: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * FIND ONE COMMENT
   */
  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        post: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  /**
   * UPDATE COMMENT
   */
  async update(id: number, data: { content: string }) {
    try {
      return await this.prisma.comment.update({
        where: { id },
        data,
        include: {
          author: true,
          post: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * DELETE COMMENT
   */
  async remove(id: number) {
    try {
      return await this.prisma.comment.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * GET COMMENTS BY POST
   */
  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * GET COMMENTS BY USER
   */
  async findByUser(userId: number) {
    return this.prisma.comment.findMany({
      where: { authorId: userId },
      include: {
        post: {
          include: {
            author: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

