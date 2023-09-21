export abstract class JwtBuildService {
  abstract signAsync(sub: number, email: string): Promise<string>;
}
