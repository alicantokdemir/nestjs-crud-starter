import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'google', description: 'Authentication provider' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Provider-specific user identifier',
  })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ example: 'alican@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Alican Tokdemir', description: 'Display name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.png',
    description: 'Profile picture URL',
  })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiPropertyOptional({
    enum: UserStatus,
    example: UserStatus.PENDING_VERIFICATION,
    description: 'Current user status',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
