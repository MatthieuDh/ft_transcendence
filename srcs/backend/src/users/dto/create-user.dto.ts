import { IsString, MinLength, IsEmail
    
 } from 'class-validator';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsEmail()
  email: string;

    @IsString()
    @MinLength(8)
    password: string;
}

export class UpdateUserDto{
    username?: string; //allow this? maybe split username and displayname
    avatar?: string;
}