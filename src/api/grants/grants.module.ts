import { Module } from '@nestjs/common';
import { GrantsService } from './grants.service';
import { GrantResolver } from './grants.resolver';
import { SharedModule } from '@shared/shared.module';
import { UsersService, GrantsHistoryService } from '@shared/services';

@Module({
  imports: [SharedModule],
  providers: [GrantResolver, GrantsService, UsersService, GrantsHistoryService],
})
export class GrantsModule {}
