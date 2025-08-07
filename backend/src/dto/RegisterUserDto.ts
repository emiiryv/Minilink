import { IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(3, 50)
  username!: string;

  @IsString()
  @Length(6, 100)
  password!: string;
}