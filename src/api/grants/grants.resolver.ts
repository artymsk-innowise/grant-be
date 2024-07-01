import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GrantsService } from './grants.service';
import {
  GrantConnection,
  UserGrantConnection,
  UserGrant,
} from './models/grant.model';
import {
  CreateUserGrantPayload,
  BasePaginationPayload,
  GetUserGrantsPayload,
} from './inputs/inputs';

@Resolver()
export class GrantResolver {
  constructor(private readonly grantsService: GrantsService) {}

  @Query(() => GrantConnection)
  async getAllGrants(
    @Args({ name: 'input', type: () => BasePaginationPayload })
    input: BasePaginationPayload,
  ): Promise<GrantConnection> {
    return this.grantsService.getAllGrants(input);
  }

  @Query(() => UserGrantConnection)
  async getUserGrants(
    @Args({ name: 'input', type: () => GetUserGrantsPayload })
    input: GetUserGrantsPayload,
  ): Promise<UserGrantConnection> {
    return this.grantsService.getUserGrants(input);
  }

  @Mutation(() => UserGrant)
  async createUserGrant(
    @Args({ name: 'input', type: () => CreateUserGrantPayload })
    grantData: CreateUserGrantPayload,
  ): Promise<UserGrant> {
    return this.grantsService.createUserGrant(grantData);
  }
}
