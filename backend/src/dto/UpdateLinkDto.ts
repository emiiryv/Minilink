

import { IsOptional, IsString, IsUrl, IsDateString } from 'class-validator';

export class UpdateLinkDto {
  @IsOptional()
  @IsUrl({}, { message: 'Geçerli bir URL giriniz.' })
  original_url?: string;

  @IsOptional()
  @IsString({ message: 'Short code metin olmalıdır.' })
  short_code?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Tarih formatı geçersiz. (örnek: 2025-12-31T12:00)' })
  expires_at?: string | null;
}