import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/infra/modules/auth/strategy';
import { Argon2Service } from 'src/infra/services/argon2/argon2.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, Argon2Service],
})
export class AuthModule {}
