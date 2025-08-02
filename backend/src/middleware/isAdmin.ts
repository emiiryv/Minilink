import { Request, Response, NextFunction } from 'express';

export default function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  if (user && user.is_admin) {
    next();
  } else {
    return res.status(403).json({ error: 'Admin yetkisi gereklidir' });
  }
}