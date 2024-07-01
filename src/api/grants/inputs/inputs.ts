import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

@InputType()
export class BasePaginationPayload {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  first?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  after?: string;
}

@InputType()
export class GetUserGrantsPayload extends BasePaginationPayload {
  @Field(() => Int)
  @IsNumber()
  userId: number;
}

@InputType()
export class CreateUserGrantPayload {
  @Field(() => Number)
  @IsNumber()
  grantId: number;

  @Field(() => Number)
  @IsNumber()
  userId: number;

  @Field(() => String)
  @IsString()
  feedback: string;

  @Field(() => Boolean)
  @IsBoolean()
  isApproved: boolean;
}
