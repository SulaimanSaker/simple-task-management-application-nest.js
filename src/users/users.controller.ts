import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import getEnhancedRes from 'src/shared/utils/getEnhancedRes';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/my-profile')
  async getMyProfile(@Request() req) {
    const result = await this.usersService.getMyProfile(req.user.id);

    return getEnhancedRes('Profile retrieved successfully', result);
  }

  @Patch('/my-profile')
  async updateMyProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.updateMyProfile(
      req.user.id,
      updateUserDto,
    );

    return getEnhancedRes('Profile updated successfully', result);
  }
}
