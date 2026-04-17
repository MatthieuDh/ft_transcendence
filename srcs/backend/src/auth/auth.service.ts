import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService
  ){}

  async signIn(username: string, pass:string): Promise<{access_token: string, refresh_token: string}> {
    const user = await this.usersService.findByName(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username, role: user.globalRole };
    return {
      access_token: await this.jwtService.signAsync(payload, {expiresIn: '15m'}),
      refresh_token: await this.jwtService.signAsync(payload, {expiresIn: '7d'}),
    };
  }

  async refresh(refreshToken: string): Promise<{access_token: string}> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {secret: process.env.JWT_SECRET});
      return {
              access_token: await this.jwtService.signAsync(payload, {expiresIn: '15m'}),
      }
    } catch {
      throw new UnauthorizedException();
    }
  }
}
