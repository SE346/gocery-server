import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User, Product } from './';

@Table({ modelName: 'Comment', tableName: 'comment' })
class Comment extends Model {
  // Columns
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true, field: 'comment_id' })
  id!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, field: 'user_mail' })
  userMail!: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.TEXT, field: 'product_id' })
  productId!: string;

  @Column({ type: DataType.STRING, field: 'content', allowNull: false })
  content!: string;

  @Column({ type: DataType.FLOAT, field: 'rating', allowNull: false })
  rating!: number;

  @Column({ type: DataType.TEXT, field: 'image', allowNull: true })
  image!: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default Comment;
