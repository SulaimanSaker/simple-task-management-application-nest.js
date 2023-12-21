import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import getEnhancedRes from 'src/shared/utils/getEnhancedRes';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.register(createUserDto);

    return getEnhancedRes('Registered successfully', result);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.usersService.login(loginDto);

    return getEnhancedRes('Logged in successfully', result);
  }
}
