import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { GlobalRole } from '@prisma/client';

interface JwtPayload {
  sub: number;
  username: string;
  role: 'USER' | 'ADMIN';
}

export type SafeUser = {
  id: number;
  username: string;
  email: string | null;
  globalRole: GlobalRole;
  avatar: string | null;
  createdAt: Date;
};

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
    if (!user.password) {
      throw new UnauthorizedException('Please sign in with Google');
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

  // In auth.service.ts
async signInOAuth(user: SafeUser) {
  const payload = { sub: user.id, username: user.username, role: user.globalRole };
  return {
    access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '15m'}),
    refresh_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }),
  };
}

async refresh(refreshToken: string): Promise<{access_token: string}> {
   try {
     const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {secret: process.env.JWT_REFRESH_SECRET});
     return {
             access_token: await this.jwtService.signAsync(
              {sub: payload.sub, username: payload.username, role: payload.role},
              {secret: process.env.JWT_SECRET, expiresIn: '15m'}),
     }
   } catch {
     throw new UnauthorizedException();
    }
 }

 async signUp(username: string, email: string, avatar: string, pass: string): Promise<any> {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(pass, salt);

 
  const newUser = await this.usersService.create({
    username,
    email,
    avatar,
    password: hashedPassword,

  });

  return this.signIn(newUser.username, pass); 
}

async validateOAuthUser(data: {email: string, googleId: string, username:string}): Promise <SafeUser>{
   let user = await this.usersService.findByGoogleId(data.googleId);
   if (user) return user;

   user = await this.usersService.findByEmail(data.email);
   if (user) {
     return this.usersService.updateGoogleId(user.id, data.googleId);
   }

    return this.usersService.createOAuthUser({
      email: data.email,
      googleId: data.googleId,
      username: data.email.split('@')[0],

    });
  }
}
