Import { IsString, MinLength } from 'class-validator';

export class SignInDto {
    @isString()
    username: string;

    @IsString()
    @MinLength(8)
    password: string;
}