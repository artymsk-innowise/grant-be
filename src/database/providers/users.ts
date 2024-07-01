import { USERS_REPOSITORY } from '@shared/utils/constants';
import { Users } from '../entities';

export const usersProvider = [
  {
    provide: USERS_REPOSITORY,
    useValue: Users,
  },
];
