
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login-dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../user/schemas/user.schema'; // Assuming you have a User schema

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate the user by email and password
  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (user && await bcrypt.compare(loginDto.password, user.password)) {
      // Returning user details excluding the password
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  // Login method: Generate JWT token after successful validation
  async login(user: any): Promise<{ access_token: string }> {
    const payload = { username: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Signup method: Register a new user, hash the password, and return the JWT token
  async signup(email: string, password: string, role: 'admin' | 'user'): Promise<{ access_token: string }> {
    const userExists = await this.userService.findByEmail(email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await this.userService.create({ email, password: hash, role });
    return this.login(user); // Generate and return JWT token
  }

  // Method to send reset password email (Placeholder for actual email logic)
  async sendResetPasswordEmail(email: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // Here, you would typically generate a reset token and send an email
    return 'Reset email would be sent here (implement logic)';
  }

  // Method to reset the user's password
  async resetPassword(dto: ResetPasswordDto, token: string): Promise<void> {
    if (!token) {
      throw new BadRequestException('Token is missing');
    }
    const user = await this.userService.findByEmail('test@example.com'); // Logic for verifying token should be added
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.password = await bcrypt.hash(dto.password, 10);
    await user.save(); // Save updated password
  }
}
