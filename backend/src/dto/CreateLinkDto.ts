

import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  originalUrl!: string;

  @IsOptional()
  @IsDateString()
  expires_at?: string;
}