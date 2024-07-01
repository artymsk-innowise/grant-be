import { Test, TestingModule } from '@nestjs/testing';
import { GrantsService } from './grants.service';
import { UsersService, GrantsHistoryService } from '../../shared/services';
import { GRANTS_REPOSITORY } from '../../shared/utils/constants';
import { HttpException, HttpStatus } from '@nestjs/common';

const GrantsHistoryServiceMock = {
  createUserGrants: jest.fn(),
  getUserGrant: jest.fn(),
};
const UsersServiceMock = {
  getUser: jest.fn(),
  getUserGrants: jest.fn(),
};
const GrantsRepositoryMock = {
  findAll: jest.fn(),
  count: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};

describe('GrantsService', () => {
  let service: GrantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrantsService,
        {
          provide: GRANTS_REPOSITORY,
          useValue: GrantsRepositoryMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: GrantsHistoryService,
          useValue: GrantsHistoryServiceMock,
        },
      ],
    }).compile();

    service = module.get<GrantsService>(GrantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all grants with pagination', async () => {
    const mockGrants = [{ id: 1 }, { id: 2 }];
    GrantsRepositoryMock.findAll.mockResolvedValue(mockGrants);
    GrantsRepositoryMock.count.mockResolvedValue(2);

    const result = await service.getAllGrants({ first: 10, after: 'MQ==' });

    expect(result.edges.length).toBe(2);
    expect(result.totalCount).toBe(2);
  });

  it('should throw an error if grant not found', async () => {
    GrantsRepositoryMock.findOne.mockResolvedValue(null);

    await expect(service.getGrant(1)).rejects.toThrow(
      new HttpException(
        'Grant with given ID doesn`t available',
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should create user grant', async () => {
    UsersServiceMock.getUser.mockResolvedValue({});
    GrantsRepositoryMock.findOne.mockResolvedValue({ update: jest.fn() });
    GrantsHistoryServiceMock.createUserGrants.mockResolvedValue({ id: 1 });
    GrantsHistoryServiceMock.getUserGrant.mockResolvedValue({
      grant: {
        foundationName: 'Foundation',
        grantName: 'Grant',
        averageAmount: 100,
        deadline: '2024-12-31',
      },
      status: { status: 'approved' },
      creationDate: new Date(),
    });

    const grantData = {
      feedback: 't',
      grantId: 1,
      userId: 1,
      isApproved: true,
    };
    const result = await service.createUserGrant(grantData);

    expect(result.foundationName).toBe('Foundation');
    expect(result.grantName).toBe('Grant');
  });

  it('should get user grants with pagination', async () => {
    UsersServiceMock.getUser.mockResolvedValue({});
    UsersServiceMock.getUserGrants.mockResolvedValue({
      edges: [],
      pageInfo: {
        endCursor: null,
        startCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      totalCount: 0,
    });

    const result = await service.getUserGrants({
      userId: 1,
      first: 10,
      after: 'MQ==',
    });

    expect(result.edges.length).toBe(0);
    expect(result.totalCount).toBe(0);
  });
});
