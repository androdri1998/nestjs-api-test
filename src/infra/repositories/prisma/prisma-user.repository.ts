import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/infra/services/prisma/prisma.service';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async create(email: string, hash: string): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email,
        hash,
      },
    });

    return user;
  }
}
