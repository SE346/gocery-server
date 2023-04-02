import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User, Rank } from './';

@Table({ modelName: 'UserToRank', tableName: 'user_to_rank' })
class UserToRank extends Model {
  // Association
  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, primaryKey: true, field: 'user_mail' })
  userMail!: string;

  @ForeignKey(() => Rank)
  @Column({ type: DataType.INTEGER, primaryKey: true, field: 'rank_id' })
  rankId!: number;

  // Column
  @Column({ type: DataType.INTEGER, field: 'monney_acc_cur' })
  monneyAccCur!: number;

  @Column({ type: DataType.INTEGER, field: 'transaction_cur' })
  transactionCur!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default UserToRank;
