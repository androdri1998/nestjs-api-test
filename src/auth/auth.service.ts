import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Argon2Service } from 'src/infra/services/argon2/argon2.service';

import { PrismaService } from 'src/infra/modules/prisma/prisma.service';
import { AuthDto } from './dto';
import { UNIQUE_CONSTRAINT_ERROR } from '../config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
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

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
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
      const user = await this.prisma.user.create({
        data: {
          email,
          hash: passwordHashed,
        },
      });

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
