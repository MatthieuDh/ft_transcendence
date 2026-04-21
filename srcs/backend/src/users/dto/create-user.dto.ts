import { IsString, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    username: string;

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