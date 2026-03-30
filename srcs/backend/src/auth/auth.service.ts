import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService){}

  async signIn(username: string, pass:string): Promise<any> {
    const user = await this.usersService.findByName(username);
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) return null;
    return user;
  }
}
