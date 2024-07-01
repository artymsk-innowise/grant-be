import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import {
  USERS_REPOSITORY,
  GRANTS_HISTORY_REPOSITORY,
  formattedDate,
  createPageInfo,
  encodeCursor,
  decodeCursor,
} from '@shared/utils';
import { Grants, GrantsHistory, Statuses, Users } from '@database/entities';
import { UserGrant, UserGrantConnection } from '@api/grants/models/grant.model';
import { Op, WhereOptions } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: typeof Users,
    @Inject(GRANTS_HISTORY_REPOSITORY)
    private readonly grantsHistoryRepository: typeof GrantsHistory,
  ) {}

  async getUser(id: number): Promise<Users> {
    const user = await this.usersRepository.findByPk<Users>(id);
    if (!user) {
      throw new HttpException(
        'User with given ID doesn`t exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async getUserGrants(
    id: number,
    first: number = 10,
    after?: string,
  ): Promise<UserGrantConnection> {
    const limit = first || 10;
    const afterCursor = after ? decodeCursor(after) : null;

    const whereCondition = {
      userId: id,
      statusId: { [Op.in]: [1, 2, 3] },
      ...(afterCursor && { id: { [Op.gt]: afterCursor } }),
    };

    const { grantsHistory, hasNextPage } = await this.getGrantsHistory(
      whereCondition,
      limit,
    );

    const edges = this.createEdges(grantsHistory);
    const pageInfo = createPageInfo<UserGrant>(edges, hasNextPage, after);

    const totalCount = await this.grantsHistoryRepository.count({
      where: { userId: id, statusId: { [Op.in]: [1, 2, 3] } },
    });

    return {
      edges,
      pageInfo,
      totalCount,
    };
  }

  private async getGrantsHistory(
    whereCondition: WhereOptions<GrantsHistory>,
    limit: number,
  ) {
    const grantsHistory = await this.grantsHistoryRepository.findAll({
      where: whereCondition,
      limit: limit + 1,
      order: [['id', 'ASC']],
      include: [
        {
          model: Grants,
          attributes: {
            exclude: ['creationDate', 'updatedOn', 'deletionDate'],
          },
        },
        {
          model: Statuses,
        },
      ],
    });

    console.log(grantsHistory);

    const hasNextPage = grantsHistory.length > limit;

    if (hasNextPage) {
      grantsHistory.pop();
    }

    return { grantsHistory, hasNextPage };
  }

  private createEdges(grantsHistory: GrantsHistory[]) {
    return grantsHistory.map((grantHistory) => ({
      cursor: encodeCursor(grantHistory.id),
      node: this.mapUserGrant(grantHistory),
    }));
  }

  private mapUserGrant(grantHistory: GrantsHistory): UserGrant {
    return {
      id: grantHistory.grantId,
      foundationName: grantHistory.grant.foundationName,
      grantName: grantHistory.grant.grantName,
      averageAmount: grantHistory.grant.averageAmount,
      deadline: grantHistory.grant.deadline,
      status: grantHistory.status.status,
      matchDate: formattedDate(grantHistory.creationDate),
    };
  }
}
