import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtBuildService } from 'src/auth/services/jwt-build.service';

@Injectable()
export class NestJsJwtService implements JwtBuildService {
  constructor(
    private readonly nestJsJwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signAsync(sub: number, email: string): Promise<string> {
    const payload = { sub, email };

    const token = await this.nestJsJwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return token;
  }
}
