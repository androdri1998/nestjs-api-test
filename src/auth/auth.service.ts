import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Argon2Service } from 'src/infra/services/hash/argon2.service';
import JwtService from 'src/infra/services/jwt/nestJsJwt.service';

import { AuthDto } from './dto';
import { UNIQUE_CONSTRAINT_ERROR } from '../config';
import { UserRepository } from 'src/common/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly argon2Service: Argon2Service,
  ) {}

  signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async signIn(dto: AuthDto): Promise<{ access_token: string }> {
    const { email, password } = dto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const passwordMacthes = await this.argon2Service.verify(
      user.hash,
      password,
    );
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
    const passwordHashed = await this.argon2Service.generateHash(password);
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
