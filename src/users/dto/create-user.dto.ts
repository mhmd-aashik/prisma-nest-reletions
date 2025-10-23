import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * CREATE USER DTO
 *
 * This DTO defines what data is required to create a user.
 * It validates input before it reaches the database.
 *
 * Benefits:
 * - Input validation
 * - Type safety for API layer
 * - Auto-generated API documentation
 * - Prevents invalid data from reaching database
 */
export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name?: string;
}
