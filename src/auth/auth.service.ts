import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { AuthDto } from './dto';
import { UNIQUE_CONSTRAINT_ERROR } from '../config';
import { UserRepository } from 'src/common/repositories/user.repository';
import { HashService } from './services/hash.service';
import { JwtBuildService } from './services/jwt-build.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtBuildService: JwtBuildService,
    private readonly config: ConfigService,
    private readonly hashService: HashService,
  ) {}

  async signToken(userId: number, email: string): Promise<string> {
    return await this.jwtBuildService.signAsync(userId, email);
  }

  async signIn(dto: AuthDto): Promise<{ access_token: string }> {
    const { email, password } = dto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const passwordMacthes = await this.hashService.verify(user.hash, password);
    if (!passwordMacthes) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const token = await this.signToken(user.id, user.email);

    return {
      access_token: token,
    };
  }

  async signUp(dto: AuthDto): Promise<{ access_token: string }> {
    const { email, password } = dto;
    const passwordHashed = await this.hashService.generateHash(password);
    try {
      const user = await this.userRepository.create(email, passwordHashed);

      const token = await this.signToken(user.id, user.email);

      return {
        access_token: token,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === UNIQUE_CONSTRAINT_ERROR) {
          throw new ForbiddenException('Credentials taken');
        }
      }

      throw error;
    }
  }
}
