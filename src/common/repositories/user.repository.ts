import { User } from '@prisma/client';
import { EditUserDto } from 'src/user/dto';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User>;
  abstract create(email: string, password: string): Promise<User>;
  abstract update(userId: number, dto: EditUserDto): Promise<User>;
  abstract getByUserId(userId: number): Promise<User>;
}
