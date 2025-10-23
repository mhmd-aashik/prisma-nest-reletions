import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * PROFILE DTO (Nested)
 *
 * This is used as a nested object within CreateUserWithProfileDto
 */
export class CreateProfileDto {
  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Bio must be at least 10 characters long' })
  bio?: string;

  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  @IsOptional()
  avatar?: string;

  @IsUrl({}, { message: 'Website must be a valid URL' })
  @IsOptional()
  website?: string;
}

/**
 * CREATE USER WITH PROFILE DTO
 *
 * Demonstrates:
 * - Nested validation with @ValidateNested
 * - Combining multiple objects
 * - ONE-TO-ONE relationship creation
 */
export class CreateUserWithProfileDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name?: string;

  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsNotEmpty({ message: 'Profile data is required' })
  profile: CreateProfileDto;
}
