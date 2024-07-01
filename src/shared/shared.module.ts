import { Module, Global } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import {
  grantsProvider,
  grantsHistoryProvider,
  statusesProvider,
  usersProvider,
} from '@database/providers';

const IMPORT_EXPORT = [DatabaseModule];

const PROVIDERS = [
  ...grantsProvider,
  ...grantsHistoryProvider,
  ...statusesProvider,
  ...usersProvider,
];

@Global()
@Module({
  imports: IMPORT_EXPORT,
  providers: PROVIDERS,
  exports: [...IMPORT_EXPORT, ...PROVIDERS],
})
export class SharedModule {}
