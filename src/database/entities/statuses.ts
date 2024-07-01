import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { GrantStatus } from '@shared/enums/enums';

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
}
