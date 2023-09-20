import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/infra/modules/auth/strategy';
import { Argon2Service } from 'src/infra/services/hash/argon2.service';
import { PrismaUserRepository } from 'src/infra/repositories/prisma/prisma-user.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { PrismaService } from 'src/infra/services/prisma/prisma.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    Argon2Service,
    PrismaService,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
})
export class AuthModule {}
