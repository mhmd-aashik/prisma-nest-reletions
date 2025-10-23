import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

/**
 * UPDATE PROFILE DTO
 *
 * All fields are optional since this is for PATCH operations.
 * Users can update just one field if they want.
 */
export class UpdateProfileDto {
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
