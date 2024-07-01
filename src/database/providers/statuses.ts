import { STATUSES_REPOSITORY } from '@shared/utils/constants';
import { Statuses } from '../entities/statuses';

export const statusesProvider = [
  {
    provide: STATUSES_REPOSITORY,
    useValue: Statuses,
  },
];
