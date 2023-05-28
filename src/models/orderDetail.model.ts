import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Order, Product } from './';

@Table({ modelName: 'OrderDetail', tableName: 'order_detail' })
class OrderDetail extends Model {
  // Columns
  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, field: 'order_id' })
  orderId!: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.TEXT, field: 'product_id' })
  productId!: string;

  @Column({ type: DataType.INTEGER, field: 'quantity' })
  quantity!: number;

  @Column({ type: DataType.INTEGER, field: 'price' })
  price!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default OrderDetail;
