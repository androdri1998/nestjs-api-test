export abstract class HashService {
  abstract generateHash(password: string): Promise<string>;
  abstract verify(hash: string, password: string): Promise<boolean>;
}
