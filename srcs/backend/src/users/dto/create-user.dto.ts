import { IsString, MinLength, IsEmail, IsOptional
    
 } from 'class-validator';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @IsOptional()
    avatar: string;
}

export class UpdateUserDto{
    username?: string;
    avatar?: string;
}