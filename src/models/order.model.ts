import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { User, Address, Product, OrderDetail } from './';
import { UUID } from 'sequelize';

@Table({ modelName: 'Order', tableName: 'order' })
class Order extends Model {
  // Associations
  @HasMany(() => OrderDetail)
  orderDetailList!: OrderDetail[];

  // Columns
  @Column({ type: DataType.UUID, primaryKey: true, field: 'order_id', defaultValue: UUID })
  id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, field: 'user_mail' })
  userMail!: string;

  @ForeignKey(() => Address)
  @Column({ type: DataType.TEXT, field: 'address_id' })
  addressId!: string;

  @Column({ type: DataType.STRING, field: 'status' })
  status!: string;

  @Column({ type: DataType.FLOAT, field: 'total' })
  total!: number;

  @Column({ type: DataType.DATE, field: 'order_date' })
  orderDate!: Date;

  @Column({ type: DataType.DATE, field: 'delivery_date' })
  deliveryDate!: Date;

  @Column({ type: DataType.INTEGER, field: 'shipping_fee' })
  shippingFee!: number;

  @Column({ type: DataType.STRING, field: 'phone_num' })
  phoneNum!: string;

  @Column({ type: DataType.STRING, field: 'payment_method' })
  paymentMethod!: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default Order;
