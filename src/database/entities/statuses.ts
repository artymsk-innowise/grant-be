import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { GrantStatus } from '@shared/enums/enums';
import { GrantsHistory } from '@database/entities/grants-history';

@Table({ timestamps: false })
export class Statuses extends Model<Statuses> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(GrantStatus)))
  status: GrantStatus;

  @HasMany(() => GrantsHistory)
  grantsHistory: GrantsHistory[];
}
