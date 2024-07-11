import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { GrantsHistory } from './index';

@Table
export class Grants extends Model<Grants> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @Unique
  @AllowNull(false)
  @Column
  foundationName: string;

  @AllowNull(false)
  @Column
  grantName: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  averageAmount: number;

  @AllowNull(false)
  @Column
  deadline: string;

  @AllowNull(false)
  @Column
  location: string;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.STRING))
  area: string[];

  @AllowNull(false)
  @Default(true)
  @Column
  isActive: boolean;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;

  @HasOne(() => GrantsHistory, {})
  grantsHistory: GrantsHistory;

  // @BelongsToMany(() => Statuses, {
  //   through: { model: () => GrantsHistory },
  // })
  // status: Statuses;
}
