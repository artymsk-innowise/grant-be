import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { USERS_REPOSITORY, GRANTS_HISTORY_REPOSITORY } from '@shared/utils';

const UsersRepositoryMock = {
  findByPk: jest.fn(),
};
const GrantsHistoryRepositoryMock = {
  findAll: jest.fn(),
  count: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USERS_REPOSITORY,
          useValue: UsersRepositoryMock,
        },
        {
          provide: GRANTS_HISTORY_REPOSITORY,
          useValue: GrantsHistoryRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get user by id', async () => {
    const mockUser = { id: 1, name: 'John Doe' };
    UsersRepositoryMock.findByPk.mockResolvedValue(mockUser);

    const result = await service.getUser(1);

    expect(result).toEqual(mockUser);
    expect(UsersRepositoryMock.findByPk).toHaveBeenCalledWith(1);
  });

  it('should throw an error if user not found', async () => {
    UsersRepositoryMock.findByPk.mockResolvedValue(null);

    await expect(service.getUser(1)).rejects.toThrow(
      new HttpException(
        'User with given ID doesn`t exist',
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should get user grants with pagination', async () => {
    const mockGrantsHistory = [
      {
        id: 1,
        grantId: 1,
        grant: {
          id: 1,
          foundationName: 'Foundation',
          grantName: 'Grant',
          averageAmount: 1000,
          deadline: '2024-12-31',
        },
        status: { id: 1, status: 'approved' },
        creationDate: new Date(),
      },
    ];

    GrantsHistoryRepositoryMock.findAll.mockResolvedValue(mockGrantsHistory);
    GrantsHistoryRepositoryMock.count.mockResolvedValue(1);

    const result = await service.getUserGrants(1, 10, null);

    expect(result.edges.length).toBe(1);
    expect(result.pageInfo.hasNextPage).toBe(false);
    expect(result.totalCount).toBe(1);
  });

  it('should throw an error if getUserGrants fails', async () => {
    GrantsHistoryRepositoryMock.findAll.mockRejectedValue(new Error('Error'));

    await expect(service.getUserGrants(1, 10, null)).rejects.toThrow(
      new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
});
