// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    const result = await this.authService.validateUser(loginDto);
    if (!result) throw new BadRequestException('Invalid email or password');
    return this.authService.login(result);
  }

  @Post('signup')
  async signup(@Body() createDto: CreateUserDto): Promise<{ access_token: string }> {
    const { email, password, role } = createDto;
    return this.authService.signup(email, password, role);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<{ message: string }> {
    try {
      const result = await this.authService.sendResetPasswordEmail(email);
      return { message: result };
    } catch (error) {
      throw new BadRequestException(error.message || 'Unexpected error');
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(resetPasswordDto, token);
    return { message: 'Password reset successful' };
  }
}
