import { Test, TestingModule } from '@nestjs/testing';
import { GrantsHistoryService } from './grants-history.service';
import { GRANTS_HISTORY_REPOSITORY } from '../utils/constants';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateGrantDto } from '../../api/grants/dto';
import { Grants, Statuses } from '@database/entities';

const GrantsHistoryRepositoryMock = {
  create: jest.fn(),
  findOne: jest.fn(),
};

describe('GrantsHistoryService', () => {
  let service: GrantsHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrantsHistoryService,
        {
          provide: GRANTS_HISTORY_REPOSITORY,
          useValue: GrantsHistoryRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<GrantsHistoryService>(GrantsHistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user grant', async () => {
    const mockGrantHistory = { id: 1 };
    GrantsHistoryRepositoryMock.create.mockResolvedValue(mockGrantHistory);

    const createGrantDto: CreateGrantDto = {
      userId: 1,
      grantId: 1,
      feedback: 'test feedback',
      isApproved: true,
    };

    const result = await service.createUserGrants(createGrantDto, 1);

    expect(result).toEqual(mockGrantHistory);
    expect(GrantsHistoryRepositoryMock.create).toHaveBeenCalledWith({
      userId: createGrantDto.userId,
      grantId: createGrantDto.grantId,
      feedback: createGrantDto.feedback,
      statusId: 1,
    });
  });

  it('should throw an error if create user grant fails', async () => {
    GrantsHistoryRepositoryMock.create.mockRejectedValue(new Error('Error'));

    const createGrantDto: CreateGrantDto = {
      userId: 1,
      grantId: 1,
      feedback: 'test feedback',
      isApproved: true,
    };

    await expect(service.createUserGrants(createGrantDto, 1)).rejects.toThrow(
      new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });

  it('should get user grant', async () => {
    const mockGrantHistory = {
      id: 1,
      grant: { id: 1, foundationName: 'Foundation', grantName: 'Grant' },
      status: { id: 1, status: 'approved' },
    };
    GrantsHistoryRepositoryMock.findOne.mockResolvedValue(mockGrantHistory);

    const result = await service.getUserGrant(1);

    expect(result).toEqual(mockGrantHistory);
    expect(GrantsHistoryRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      include: [
        { model: Grants, as: 'grant' },
        { model: Statuses, as: 'status' },
      ],
    });
  });

  it('should throw an error if get user grant fails', async () => {
    GrantsHistoryRepositoryMock.findOne.mockRejectedValue(new Error('Error'));

    await expect(service.getUserGrant(1)).rejects.toThrow(
      new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
});
