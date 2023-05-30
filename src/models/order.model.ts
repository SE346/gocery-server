import { v4 as uuid } from 'uuid';
import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { User, Address, OrderDetail } from './';
import { OrderStatus, PaymentType } from '../utils/type';

@Table({ modelName: 'Order', tableName: 'order' })
class Order extends Model {
  // Associations
  @HasMany(() => OrderDetail)
  orderDetailList!: OrderDetail[];

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Address)
  address!: Address;

  // Columns
  @Column({ type: DataType.UUID, primaryKey: true, field: 'order_id', defaultValue: uuid() })
  id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, field: 'user_mail' })
  userMail!: string;

  @ForeignKey(() => Address)
  @Column({ type: DataType.INTEGER, field: 'address_id' })
  addressId!: number;

  @Column({ type: DataType.STRING, field: 'status' })
  status!: OrderStatus;

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
  paymentMethod!: PaymentType;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default Order;
