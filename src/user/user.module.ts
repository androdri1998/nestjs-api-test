import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/infra/services/prisma/prisma.service';
import { UserRepository } from 'src/repositories/user.repository';
import { PrismaUserRepository } from 'src/infra/repositories/prisma/prisma-user.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
})
export class UserModule {}
