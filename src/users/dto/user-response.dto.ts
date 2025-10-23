import { Exclude, Expose, Type } from 'class-transformer';

/**
 * PROFILE RESPONSE DTO
 * 
 * Controls what profile data is sent to clients
 */
export class ProfileResponseDto {
  @Expose()
  id: number;

  @Expose()
  bio?: string;

  @Expose()
  avatar?: string;

  @Expose()
  website?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // userId is excluded from response for cleaner API
  @Exclude()
  userId: number;
}

/**
 * USER RESPONSE DTO
 * 
 * Controls what user data is sent to clients.
 * This is important for:
 * - Hiding sensitive fields (like passwords if you had them)
 * - Controlling API response shape
 * - Consistent API responses
 * 
 * Note: This example doesn't have sensitive data, but in real apps:
 * - Password hashes should be @Exclude()
 * - Internal IDs might be @Exclude()
 * - Timestamps might be formatted
 */
export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ProfileResponseDto)
  profile?: ProfileResponseDto;

  // If you had a password field, you'd exclude it:
  // @Exclude()
  // password: string;
}

