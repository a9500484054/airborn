/**
 * Auth Service
 * Handles authentication business logic
 */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from './dto/password-reset.dto';
import { InviteUserDto } from '../users/dto/user.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  /**
   * Register a new user (requires email verification)
   */
  async register(registerDto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check if email verification is required
    const requireVerification = this.configService.get<string>('REQUIRE_EMAIL_VERIFICATION') === 'true';

    if (!requireVerification) {
      // Create user and auto-verify if not required
      const user = await this.usersService.create(registerDto);
      
      // Generate tokens and log in
      const tokens = await this.generateTokens(user);
      await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        success: true,
        message: 'Registration successful!',
        requiresVerification: false,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          isEmailVerified: true,
        },
      };
    }

    // Create user (not verified yet) if verification is required
    const user = await this.usersService.createUnverified(registerDto);

    // Generate verification token
    const verificationToken = this.generateVerificationToken();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // 24 hours

    await this.usersService.setVerificationToken(user.id, verificationToken, tokenExpires);

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationToken,
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail registration, just log the error
    }

    return {
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true,
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await user.validatePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if email verification is required
    const requireVerification = this.configService.get<string>('REQUIRE_EMAIL_VERIFICATION') === 'true';
    
    if (requireVerification && !user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in. Check your inbox for the verification link.');
    }

    const validation = await this.usersService.validateForAuth(user);
    if (!validation.isValid) {
      throw new UnauthorizedException(validation.reason);
    }

    const tokens = await this.generateTokens(user);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
      });

      const user = await this.usersService.findByIdWithSensitive(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const validation = await this.usersService.validateForAuth(user);
      if (!validation.isValid) {
        throw new UnauthorizedException(validation.reason);
      }

      const tokens = await this.generateTokens(user);
      await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user
   */
  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  /**
   * Validate user credentials (for local strategy)
   */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return null;
    }

    const validation = await this.usersService.validateForAuth(user);
    if (!validation.isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  /**
   * Generate JWT tokens
   */
  private async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_EXPIRATION') || '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Get current user info
   */
  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    return user;
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    await this.usersService.verifyEmail(user.id);

    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    return { success: true, message: 'Email verified successfully! You can now log in.' };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new verification token
    const verificationToken = this.generateVerificationToken();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // 24 hours

    await this.usersService.setVerificationToken(user.id, verificationToken, tokenExpires);

    // Send verification email
    await this.emailService.sendVerificationEmail(user.email, user.name, verificationToken);

    return { success: true, message: 'Verification email sent!' };
  }

  /**
   * Generate verification token
   */
  private generateVerificationToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }

  /**
   * Forgot password - send reset token
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);

    if (!user) {
      // Don't reveal if email exists or not for security
      return { 
        success: true, 
        message: 'If an account exists with this email, you will receive password reset instructions.' 
      };
    }

    // Generate reset token
    const resetToken = this.generateVerificationToken();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 1); // 1 hour

    await this.usersService.setPasswordResetToken(user.id, resetToken, tokenExpires);

    // Send reset email
    try {
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken,
      );
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new BadRequestException('Failed to send reset email');
    }

    return { 
      success: true, 
      message: 'Password reset instructions have been sent to your email.' 
    };
  }

  /**
   * Reset password with token
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByPasswordResetToken(resetPasswordDto.token);

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Update password
    await this.usersService.updatePassword(user.id, resetPasswordDto.newPassword);

    // Clear reset token
    await this.usersService.clearPasswordResetToken(user.id);

    return { 
      success: true, 
      message: 'Password has been reset successfully. You can now log in with your new password.' 
    };
  }

  /**
   * Invite user by admin (create user with temporary password)
   */
  async inviteUser(inviteUserDto: InviteUserDto, invitedByUserId: string) {
    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(inviteUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Generate temporary password
    const temporaryPassword = this.generateTemporaryPassword();

    // Create user DTO with generated password
    const createUserDto = {
      email: inviteUserDto.email,
      name: inviteUserDto.name,
      phone: inviteUserDto.phone,
      password: temporaryPassword,
      role: inviteUserDto.role || UserRole.USER,
    };

    // Create user (not verified yet)
    const user = await this.usersService.createUnverified(createUserDto);

    // Generate verification token
    const verificationToken = this.generateVerificationToken();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // 24 hours

    await this.usersService.setVerificationToken(user.id, verificationToken, tokenExpires);

    // Send invitation email with temporary password
    try {
      await this.emailService.sendInvitationEmail(
        user.email,
        user.name,
        verificationToken,
        temporaryPassword,
      );
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      // Don't fail user creation, just log the error
    }

    return {
      success: true,
      message: 'User invited successfully! Invitation email has been sent.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Generate temporary password (8 characters with letters and numbers)
   */
  private generateTemporaryPassword(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Change password (for authenticated users)
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findByIdWithSensitive(userId);

    // Validate current password
    const isCurrentPasswordValid = await user.validatePassword(changePasswordDto.currentPassword);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Update password
    await this.usersService.updatePassword(user.id, changePasswordDto.newPassword);

    return {
      success: true,
      message: 'Password has been changed successfully',
    };
  }
}
