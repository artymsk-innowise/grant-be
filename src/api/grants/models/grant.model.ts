import { Field, ObjectType, Int, Float, OmitType } from '@nestjs/graphql';
import { PageInfo } from './page.model';

@ObjectType()
export class BaseGrant {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  foundationName: string;

  @Field(() => String)
  grantName: string;

  @Field(() => Float)
  averageAmount: number;

  @Field(() => String)
  deadline: string;
}

@ObjectType()
export class Grant extends BaseGrant {
  @Field(() => String)
  location: string;

  @Field(() => [String])
  area: string[];

  @Field(() => Boolean)
  isActive: boolean;
}

@ObjectType()
export class UserGrant extends BaseGrant {
  @Field()
  status: string;

  @Field(() => String, { nullable: true })
  matchDate?: string;
}

@ObjectType()
export class GrantEdge {
  @Field(() => String)
  cursor: string;

  @Field(() => Grant)
  node: Grant;
}

@ObjectType()
export class UserGrantEdge extends OmitType(GrantEdge, ['node'] as const) {
  @Field(() => UserGrant)
  node: UserGrant;
}

@ObjectType()
export class GrantConnection {
  @Field(() => [GrantEdge])
  edges: GrantEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => Int)
  totalCount: number;
}

@ObjectType()
export class UserGrantConnection extends OmitType(GrantConnection, [
  'edges',
] as const) {
  @Field(() => [UserGrantEdge])
  edges: UserGrantEdge[];
}

@ObjectType()
export class CreateGrantResponse {
  @Field()
  statusCode: number;

  @Field()
  message: string;
}
