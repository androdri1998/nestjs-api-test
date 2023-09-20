import { User } from '@prisma/client';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User>;
  abstract create(email: string, password: string): Promise<User>;
}
