import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * USERS SERVICE
 * 
 * This service demonstrates how to work with Prisma relationships.
 * It shows CRUD operations and how to include related data.
 */
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREATE A USER
   * Basic creation without relationships
   */
  async create(data: { email: string; name?: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  /**
   * CREATE USER WITH PROFILE (ONE-TO-ONE)
   * This demonstrates creating a user and their profile in one operation
   */
  async createWithProfile(data: {
    email: string;
    name?: string;
    profile: {
      bio?: string;
      avatar?: string;
      website?: string;
    };
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        // Create related profile using nested create
        profile: {
          create: data.profile,
        },
      },
      // Include the profile in the response
      include: {
        profile: true,
      },
    });
  }

  /**
   * FIND ALL USERS
   * You can include related data using 'include'
   */
  async findAll(includeRelations = false) {
    return this.prisma.user.findMany({
      include: includeRelations
        ? {
            profile: true, // Include ONE-TO-ONE relationship
            posts: true, // Include ONE-TO-MANY relationship
            comments: true, // Include ONE-TO-MANY relationship
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * FIND ONE USER BY ID
   * Demonstrates how to include nested relationships
   */
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true, // Include user's profile
        posts: {
          // Include user's posts
          include: {
            categories: {
              // Include categories for each post (nested include)
              include: {
                category: true,
              },
            },
            comments: true, // Include comments for each post
          },
        },
        comments: true, // Include all user's comments
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * FIND USER BY EMAIL
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        posts: true,
      },
    });
  }

  /**
   * UPDATE USER
   */
  async update(id: number, data: { email?: string; name?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        profile: true,
      },
    });
  }

  /**
   * UPDATE USER'S PROFILE (ONE-TO-ONE)
   * Demonstrates updating related data
   */
  async updateProfile(
    userId: number,
    profileData: {
      bio?: string;
      avatar?: string;
      website?: string;
    },
  ) {
    // Check if profile exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.profile) {
      // Update existing profile
      return this.prisma.profile.update({
        where: { userId },
        data: profileData,
      });
    } else {
      // Create new profile if it doesn't exist
      return this.prisma.profile.create({
        data: {
          ...profileData,
          userId,
        },
      });
    }
  }

  /**
   * DELETE USER
   * CASCADE DELETE: When a user is deleted, their profile, posts, and comments
   * are also deleted automatically (because of onDelete: Cascade in schema)
   */
  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * GET USER STATISTICS
   * Demonstrates aggregation with relationships
   */
  async getUserStats(userId: number) {
    const user = await this.findOne(userId);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      stats: {
        totalPosts: user.posts.length,
        totalComments: user.comments.length,
        hasProfile: !!user.profile,
      },
    };
  }
}

