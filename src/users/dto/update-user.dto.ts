import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * UPDATE USER DTO
 * 
 * Uses PartialType to make all fields from CreateUserDto optional.
 * This is a common pattern - update DTOs are often partial versions of create DTOs.
 * 
 * Benefits:
 * - Reuses validation rules from CreateUserDto
 * - All fields are optional for PATCH operations
 * - Maintains consistency between create and update
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}

