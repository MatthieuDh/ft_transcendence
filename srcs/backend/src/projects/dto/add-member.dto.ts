import { IsInt, IsString, IsIn } from 'class-validator';

export class AddMemberDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsIn(['GUEST', 'MEMBER', 'PROJECT_LEADER'])
  role: string;
}