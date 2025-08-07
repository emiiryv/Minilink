import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RegisterUserDto } from '../dto/RegisterUserDto';
import { LoginUserDto } from '../dto/LoginUserDto';

// Yeni kullanıcı kaydı işlemini yöneten controller fonksiyonu
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = plainToInstance(RegisterUserDto, req.body);
    await validateOrReject(dto);

    const user = await registerUser(dto.username, dto.password);
    res.status(201).json({ message: 'Kayıt başarılı', user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
}

// Kullanıcı girişi işlemini yöneten controller fonksiyonu
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = plainToInstance(LoginUserDto, req.body);
    await validateOrReject(dto);

    const { token, user } = await loginUser(dto.username, dto.password);

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