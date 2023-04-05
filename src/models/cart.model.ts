import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User, Product } from './';

@Table({ modelName: 'Cart', tableName: 'cart' })
class Cart extends Model {
  // Columns
  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, primaryKey: true, field: 'user_mail' })
  userMail!: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.TEXT, primaryKey: true, field: 'product_id' })
  productId!: string;

  @Column({ type: DataType.INTEGER, field: 'quantity' })
  quantity!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default Cart;
