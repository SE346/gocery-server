import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { User, UserToRank } from './';

@Table({ modelName: 'Rank', tableName: 'rank' })
class Rank extends Model {
  //Association
  @BelongsToMany(() => User, () => UserToRank)
  users?: User[];

  // Column
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'rank_id',
  })
  id!: number;

  @Column({ type: DataType.STRING, field: 'rank_name' })
  rankName!: string;

  @Column({ type: DataType.STRING, field: 'rank_description' })
  rankDescription?: string;

  @Column({ type: DataType.STRING, field: 'next_rank' })
  nextRank?: string;

  @Column({ type: DataType.INTEGER, field: 'transaction_target' })
  transactionTarget!: number;

  @Column({ type: DataType.INTEGER, field: 'monney_acc_target' })
  monneyAccTarget!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default Rank;
