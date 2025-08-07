import { IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}