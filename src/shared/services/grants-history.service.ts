import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { GRANTS_HISTORY_REPOSITORY } from '@shared/utils/constants';
import { GrantsHistory, Grants, Statuses } from '@database/entities';
import { CreateGrantDto } from '@api/grants/dto';

@Injectable()
export class GrantsHistoryService {
  constructor(
    @Inject(GRANTS_HISTORY_REPOSITORY)
    private readonly grantsHistoryRepository: typeof GrantsHistory,
  ) {}

  async createUserGrants(
    data: CreateGrantDto,
    status: number,
  ): Promise<GrantsHistory> {
    try {
      const { userId, grantId, feedback } = data;
      return await this.grantsHistoryRepository.create({
        userId,
        grantId,
        feedback,
        statusId: status,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserGrant(grantHistoryId: number): Promise<GrantsHistory> {
    try {
      return await this.grantsHistoryRepository.findOne({
        where: { id: grantHistoryId },
        include: [
          { model: Grants, as: 'grant' },
          { model: Statuses, as: 'status' },
        ],
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
