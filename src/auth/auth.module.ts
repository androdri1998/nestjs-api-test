import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportJwtStrategy } from 'src/infra/modules/auth/strategy';
import { Argon2Service } from 'src/infra/services/hash/argon2.service';
import { PrismaUserRepository } from 'src/infra/repositories/prisma/prisma-user.repository';
import { UserRepository } from 'src/common/repositories/user.repository';
import { PrismaService } from 'src/infra/services/prisma/prisma.service';
import { JwtStrategy } from './strategies';
import { HashService } from './services/hash.service';
import { JwtBuildService } from './services/jwt-build.service';
import { NestJsJwtService } from 'src/infra/services/jwt/nest-js-jwt.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: JwtStrategy, useClass: PassportJwtStrategy },
    { provide: HashService, useClass: Argon2Service },
    PrismaService,
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: JwtBuildService, useClass: NestJsJwtService },
  ],
})
export class AuthModule {}
