import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  country: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  fcm_token: string;
}
