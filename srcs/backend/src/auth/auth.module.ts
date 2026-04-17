import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule, 
    JwtModule.registerAsync({
  useFactory: () => ({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '15m' },
  }),
}),
  PassportModule
],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
