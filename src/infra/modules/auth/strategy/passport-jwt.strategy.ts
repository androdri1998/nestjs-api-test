import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtStrategy } from 'src/auth/strategies';
import { UserRepository } from 'src/common/repositories/user.repository';

@Injectable()
export class PassportJwtStrategy
  extends PassportStrategy(Strategy, 'jwt')
  implements JwtStrategy
{
  constructor(
    config: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const userId = payload.sub;
    const user = await this.userRepository.getByUserId(userId);

    delete user.hash;

    return user;
  }
}
