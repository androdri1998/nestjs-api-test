import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { HashService } from 'src/auth/services/hash.service';

@Injectable()
export class Argon2Service implements HashService {
  async generateHash(password: string) {
    const passwordHashed = await argon.hash(password);
    return passwordHashed;
  }

  async verify(hash: string, password: string) {
    const passwordMacthes = await argon.verify(hash, password);
    return passwordMacthes;
  }
}
