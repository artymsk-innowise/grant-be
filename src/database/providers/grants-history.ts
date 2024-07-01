import { GRANTS_HISTORY_REPOSITORY } from '@shared/utils/constants';
import { GrantsHistory } from '../entities';

export const grantsHistoryProvider = [
  {
    provide: GRANTS_HISTORY_REPOSITORY,
    useValue: GrantsHistory,
  },
];
