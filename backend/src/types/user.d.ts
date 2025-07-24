export interface TokenPayload {
    id: number;
    username: string;
    is_admin?: boolean;
    iat?: number;
    exp?: number;
  }