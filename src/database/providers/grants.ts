import { GRANTS_REPOSITORY } from '@shared/utils/constants';
import { Grants } from '../entities';

export const grantsProvider = [
  {
    provide: GRANTS_REPOSITORY,
    useValue: Grants,
  },
];
