import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { UserRepository } from 'src/common/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.userRepository.update(userId, dto);

    delete user.hash;

    return user;
  }
}
