<<<<<<< HEAD
import { IsString, MinLength, IsEmail
    
 } from 'class-validator';
=======
import { IsString, MinLength, IsEmail } from 'class-validator';
>>>>>>> OAuth

export class CreateUserDto {
    @IsString()
    username: string;

    @IsEmail()
  email: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}

export class UpdateUserDto{
    username?: string;
    avatar?: string;
}