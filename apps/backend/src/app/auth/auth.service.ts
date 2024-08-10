import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    const expiresIn = 28800;  // 8 hours in seconds
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: `${expiresIn}s` }),
      expiresAt: expiresAt,
    };
  }
}
