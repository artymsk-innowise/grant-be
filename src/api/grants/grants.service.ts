import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { GRANTS_REPOSITORY } from '@shared/utils/constants';
import { Grants } from '@database/entities';
import { CreateGrantDto } from './dto';
import {
  formattedDate,
  decodeCursor,
  encodeCursor,
  createPageInfo,
} from '@shared/utils';
import { UsersService, GrantsHistoryService } from '@shared/services';
import {
  GrantConnection,
  UserGrantConnection,
  GrantEdge,
  Grant,
  UserGrant,
} from './models/grant.model';
import { BasePaginationPayload, GetUserGrantsPayload } from './inputs/inputs';
import { Op, WhereOptions } from 'sequelize';

@Injectable()
export class GrantsService {
  constructor(
    @Inject(GRANTS_REPOSITORY) private readonly grantsRepository: typeof Grants,
    private readonly usersService: UsersService,
    private readonly grantsHistoryService: GrantsHistoryService,
  ) {}

  private async getGrants(whereCondition: WhereOptions<Grants>, limit: number) {
    const grants = await this.grantsRepository.findAll({
      where: whereCondition,
      limit: limit + 1, // Fetch one extra record to determine if there is a next page
      order: [['id', 'ASC']],
    });

    if (!grants) {
      throw new HttpException('Grants are not found', HttpStatus.NOT_FOUND);
    }

    const hasNextPage = grants.length > limit;
    if (hasNextPage) {
      grants.pop(); // Remove the extra record
    }

    return { grants, hasNextPage };
  }

  private createEdges(grants: Grants[]): GrantEdge[] {
    return grants.map((grant) => ({
      cursor: encodeCursor(grant.id),
      node: grant,
    }));
  }

  async getAllGrants({
    first,
    after,
  }: BasePaginationPayload): Promise<GrantConnection> {
    const limit = first || 10;
    const afterCursor = after ? decodeCursor(after) : null;

    const whereCondition = afterCursor
      ? { id: { [Op.gt]: afterCursor }, isActive: true }
      : { isActive: true };

    const { grants, hasNextPage } = await this.getGrants(whereCondition, limit);

    const edges = this.createEdges(grants);
    const pageInfo = createPageInfo<Grant>(edges, hasNextPage, after);

    const totalCount = await this.grantsRepository.count({
      where: { isActive: true },
    });

    return {
      edges,
      pageInfo,
      totalCount,
    };
  }

  async getGrant(id: number): Promise<Grants> {
    const grant = await this.grantsRepository.findOne<Grants>({
      where: { id, isActive: true },
      attributes: { exclude: ['creationDate', 'updatedOn', 'deletionDate'] },
    });
    if (!grant) {
      throw new HttpException(
        'Grant with given ID doesn`t available',
        HttpStatus.NOT_FOUND,
      );
    }
    return grant;
  }

  async createUserGrant(grantData: CreateGrantDto): Promise<UserGrant> {
    const { grantId, userId, isApproved } = grantData;
    // Check if user exist by id and grant available
    await this.usersService.getUser(userId);
    const grant = await this.getGrant(grantId);

    const status = isApproved === true ? 1 : 4;

    const createdUserGrant = await this.grantsHistoryService.createUserGrants(
      grantData,
      status,
    );

    try {
      await grant.update({ isActive: false });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const userGrant = await this.grantsHistoryService.getUserGrant(
      createdUserGrant.id,
    );

    return {
      foundationName: userGrant.grant.foundationName,
      grantName: userGrant.grant.grantName,
      averageAmount: userGrant.grant.averageAmount,
      deadline: userGrant.grant.deadline,
      status: userGrant.status.status,
      matchDate: formattedDate(userGrant.creationDate),
    } as UserGrant;
  }

  async getUserGrants({
    userId,
    first,
    after,
  }: GetUserGrantsPayload): Promise<UserGrantConnection> {
    await this.usersService.getUser(userId);
    return await this.usersService.getUserGrants(userId, first, after);
  }
}
