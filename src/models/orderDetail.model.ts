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
import { Order, Product } from './';

@Table({ modelName: 'OrderDetail', tableName: 'order_detail' })
class OrderDetail extends Model {
  // Associations
  @BelongsTo(() => Order)
  order!: Order;

  @BelongsTo(() => Product)
  product!: Product;

  // Columns
  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, field: 'order_id', primaryKey: true })
  orderId!: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.TEXT, field: 'product_id', primaryKey: true })
  productId!: string;

  @Column({ type: DataType.INTEGER, field: 'quantity' })
  quantity!: number;

  @Column({ type: DataType.FLOAT, field: 'price' })
  price!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default OrderDetail;
