import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'gizli-anahtar';

export default function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token bulunamadı' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ error: 'Token süresi dolmuş' });
      return;
    } else if (err) {
      res.status(403).json({ error: 'Geçersiz token' });
      return;
    }

    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      !('id' in decoded) ||
      !('username' in decoded)
    ) {
      res.status(403).json({ error: 'Geçersiz token' });
      return;
    }

    (req as Request & { user?: TokenPayload }).user = decoded as TokenPayload;
    next();
  });
}