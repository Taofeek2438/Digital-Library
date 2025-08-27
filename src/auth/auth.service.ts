import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import * as ms from 'ms';
import { StandardResponse } from 'src/common/response/standard-response';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async register(email: string, password: string, role: string = 'user') {
    const existingUser = await this.usersRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException(
        new StandardResponse(
            false,
            'Email already in use',
            null,
            400
        ).toJSON(),
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ email, password: hashedPassword, role });
    const savedUser = await this.usersRepo.save(user);

    return new StandardResponse(
      true,
      'User registered successfully',
      {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      },
    ).toJSON();
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Decode token to extract expiration
    const decoded: any = this.jwtService.decode(accessToken);
    const exp = decoded['exp']; // seconds since epoch
    const now = Math.floor(Date.now() / 1000);

    const remainingSeconds = exp - now;

    // Convert remaining seconds to human-readable string
    const humanReadableExpiry = this.formatExpiry(remainingSeconds);

    return new StandardResponse(
      true,
      'Login successful',
      { 
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: humanReadableExpiry,
      },
    ).toJSON();
  }

  private formatExpiry(seconds: number): string {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0 ? `${hours} hours ${minutes} minutes` : `${hours} hour`;
    }
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return hours > 0 ? `${days} days ${hours} hours` : `${days} days`;
  }
}
