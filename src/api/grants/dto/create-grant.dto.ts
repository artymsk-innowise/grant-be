import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateGrantDto {
  @IsNumber()
  grantId: number;

  @IsNumber()
  userId: number;

  @IsString()
  feedback: string;

  @IsBoolean()
  isApproved: boolean;
}
