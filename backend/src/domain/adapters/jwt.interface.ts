export interface IJwtService {
  sign(payload: Record<string, unknown>): Promise<string>;
  verify<T extends object = any>(token: string): Promise<T>;
  signRefreshToken(payload: Record<string, unknown>): Promise<string>;
}
