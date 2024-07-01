import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '@shared/utils/constants';
import { Grants, GrantsHistory, Statuses, Users } from './entities';

export const databaseProvider = [
  {
    provide: SEQUELIZE,
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: configService.get('DB_DIALECT'),
        host: configService.get('DB_HOST'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE_NAME'),
      });
      sequelize.addModels([GrantsHistory, Grants, Statuses, Users]);
      await sequelize.sync({
        force: configService.get('FORCE_SYNC_SEQUELIZE') === 'true',
      });

      return sequelize;
    },
    inject: [ConfigService],
  },
];
