/**
 * DTOs for password reset
 */
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'abc123token', description: 'Reset token' })
  @IsNotEmpty({ message: 'Token is required' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'newpassword123', description: 'New password' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsString()
  newPassword: string;
}
