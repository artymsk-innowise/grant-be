import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Grants, Statuses, Users } from './index';

@Table({
  indexes: [
    {
      unique: true,
      fields: ['grantId', 'userId', 'statusId'],
      name: 'user_grant_status_unique_index',
    },
  ],
})
export class GrantsHistory extends Model<GrantsHistory> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id: number;

  @AllowNull(false)
  @ForeignKey(() => Grants)
  @Column
  grantId: number;

  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column
  userId: number;

  @AllowNull(false)
  @ForeignKey(() => Statuses)
  @Column
  statusId: number;

  @AllowNull(false)
  @Column
  feedback: string;

  @CreatedAt
  creationDate: Date;

  @DeletedAt
  deletionDate: Date;

  @BelongsTo(() => Statuses)
  status: Statuses;

  @BelongsTo(() => Grants)
  grant: Grants;

  @BelongsTo(() => Users)
  user: Users;
}
