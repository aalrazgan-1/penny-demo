import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() userDto: any) {
    return this.userService.createUser(userDto);
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string): Promise<{ isDuplicate: boolean }> {
    const isDuplicate = await this.userService.isEmailDuplicate(email);
    return { isDuplicate };
  }
}
