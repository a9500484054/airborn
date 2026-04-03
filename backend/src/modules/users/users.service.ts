/**
 * Users Service
 * Handles user-related business logic
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UpdateUserRoleDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Create a new unverified user
   */
  async createUnverified(createUserDto: CreateUserDto): Promise<User> {
    // Hash password before saving
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = this.usersRepository.create({
      ...createUserDto,
      passwordHash,
      isEmailVerified: false,
    });
    return await this.usersRepository.save(user);
  }

  /**
   * Set verification token
   */
  async setVerificationToken(userId: string, token: string, expires: Date): Promise<void> {
    await this.usersRepository.update(userId, {
      emailVerificationToken: token,
      emailVerificationTokenExpires: expires,
    });
  }

  /**
   * Find user by verification token
   */
  async findByVerificationToken(token: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          emailVerificationToken: token,
          isEmailVerified: false,
        },
        select: ['id', 'email', 'name', 'isEmailVerified', 'emailVerificationToken', 'emailVerificationTokenExpires'],
      });

      console.log('Find user by token:', token, 'Found:', user ? user.email : 'null');
      if (user) {
        console.log('Token expires:', user.emailVerificationTokenExpires, 'Now:', new Date(), 'Valid:', user.emailVerificationTokenExpires! > new Date());
      }

      // Manual date comparison
      if (user && user.emailVerificationToken === token && user.emailVerificationTokenExpires) {
        if (user.emailVerificationTokenExpires > new Date()) {
          return user;
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding user by token:', error);
      return null;
    }
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    });
  }

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password before saving
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      passwordHash,
    });
    return await this.usersRepository.save(user);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email, isDeleted: false },
      withDeleted: true,
      select: ['id', 'email', 'passwordHash', 'name', 'phone', 'role', 'avatar', 'isBlocked', 'isDeleted', 'refreshToken', 'isEmailVerified', 'createdAt', 'updatedAt'],
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, isDeleted: false },
      select: ['id', 'email', 'name', 'phone', 'role', 'avatar', 'isBlocked', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Find user by ID with sensitive data (for internal use)
   */
  async findByIdWithSensitive(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, isDeleted: false },
      withDeleted: true,
      select: ['id', 'email', 'passwordHash', 'name', 'phone', 'role', 'avatar', 'isBlocked', 'isDeleted', 'refreshToken', 'isEmailVerified', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Get all users with pagination and filtering
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    search?: string,
    role?: UserRole,
    isBlocked?: boolean,
    sortBy: 'createdAt' | 'name' = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    const where: FindOptionsWhere<User> = { isDeleted: false };

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (role) {
      where.role = role;
    }

    if (isBlocked !== undefined) {
      where.isBlocked = isBlocked;
    }

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: sortOrder },
      select: ['id', 'email', 'name', 'phone', 'role', 'avatar', 'isBlocked', 'createdAt', 'updatedAt'],
    });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update user profile
   */
  async update(id: string, updateUserDto: UpdateUserDto, currentUserId: string): Promise<User> {
    const user = await this.findById(id);

    // Users can only update their own profile unless they're admin
    if (user.id !== currentUserId) {
      const currentUser = await this.findById(currentUserId);
      if (currentUser.role !== UserRole.ADMIN) {
        throw new ForbiddenException('You can only update your own profile');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  /**
   * Update user role (admin only)
   */
  async updateRole(id: string, updateUserRoleDto: UpdateUserRoleDto): Promise<User> {
    const user = await this.findById(id);
    user.role = updateUserRoleDto.role;
    return await this.usersRepository.save(user);
  }

  /**
   * Block/unblock user (admin only)
   */
  async toggleBlock(id: string, isBlocked: boolean): Promise<User> {
    const user = await this.findById(id);
    user.isBlocked = isBlocked;
    return await this.usersRepository.save(user);
  }

  /**
   * Soft delete user
   */
  async remove(id: string): Promise<void> {
    const user = await this.findByIdWithSensitive(id);
    user.isDeleted = true;
    user.email = `deleted_${user.id}@deleted.com`; // Free up email
    await this.usersRepository.save(user);
  }

  /**
   * Update refresh token
   */
  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken });
  }

  /**
   * Set password reset token
   */
  async setPasswordResetToken(userId: string, token: string, expires: Date): Promise<void> {
    await this.usersRepository.update(userId, {
      passwordResetToken: token,
      passwordResetTokenExpires: expires,
    });
  }

  /**
   * Find user by password reset token
   */
  async findByPasswordResetToken(token: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          passwordResetToken: token,
        },
        select: ['id', 'email', 'name', 'passwordResetToken', 'passwordResetTokenExpires'],
      });

      if (user && user.passwordResetToken === token && user.passwordResetTokenExpires) {
        if (user.passwordResetTokenExpires > new Date()) {
          return user;
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding user by reset token:', error);
      return null;
    }
  }

  /**
   * Update password
   */
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await this.usersRepository.update(userId, { passwordHash });
  }

  /**
   * Clear password reset token
   */
  async clearPasswordResetToken(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      passwordResetToken: null,
      passwordResetTokenExpires: null,
    });
  }

  /**
   * Validate user for authentication
   */
  async validateForAuth(user: User): Promise<{ isValid: boolean; reason?: string }> {
    if (user.isDeleted) {
      return { isValid: false, reason: 'User account has been deleted' };
    }

    if (user.isBlocked) {
      return { isValid: false, reason: 'User account is blocked' };
    }

    return { isValid: true };
  }
}
