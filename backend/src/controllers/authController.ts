import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';

// Yeni kullanıcı kaydı işlemini yöneten controller fonksiyonu
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username, password } = req.body;


  try {
    const user = await registerUser(username, password);
    res.status(201).json({ message: 'Kayıt başarılı', user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
}

// Kullanıcı girişi işlemini yöneten controller fonksiyonu
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username, password } = req.body;

  try {
    const { token, user } = await loginUser(username, password);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
      }
    });
  } catch (err) {
    next(err);
  }
}