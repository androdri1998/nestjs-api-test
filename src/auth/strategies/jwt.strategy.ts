import { User } from '@prisma/client';

export abstract class JwtStrategy {
  abstract validate(payload: { sub: number; email: string }): Promise<User>;
}
