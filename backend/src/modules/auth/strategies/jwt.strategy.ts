/**
 * JWT Strategy
 * Validates JWT tokens for authentication
 * 
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import type { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET') || 'default-secret';
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: string;
  }): Promise<AuthenticatedUser> {
    const user = await this.usersService.findByIdWithSensitive(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const validation = await this.usersService.validateForAuth(user);
    if (!validation.isValid) {
      throw new UnauthorizedException(validation.reason);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
