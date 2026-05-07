import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GoogleAuthGuard } from './guards/google.guard';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto){
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('refresh')
  refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refresh(body.refresh_token);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth(){
  }

  @Get('google/callback')
@UseGuards(GoogleAuthGuard)
async googleAuthCallback(@Request() req, @Res() res: Response){
  console.log('Google callback reached');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  const tokens = await this.authService.signInOAuth(req.user);
  console.log('tokens:', tokens);
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost';
    res.redirect(`${frontendUrl}/login?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`);  }
}

