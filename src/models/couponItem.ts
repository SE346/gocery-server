import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsTo,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';
import Coupon from './coupon.model';
import Order from './order.model';

@Table({ modelName: 'CouponItem', tableName: 'coupon_item' })
class CouponItem extends Model {
  // Associations
  @BelongsTo(() => Coupon)
  coupon!: Coupon;

  @HasOne(() => Order)
  order!: Order;

  // Columns
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'coupon_item_id',
  })
  id!: number;

  @ForeignKey(() => Coupon)
  @Column({ type: DataType.INTEGER, field: 'coupon_id' })
  couponId!: number;

  @Column({ type: DataType.STRING, field: 'code' })
  code!: string;

  @Column({ type: DataType.BOOLEAN, field: 'is_active' })
  isActive!: boolean;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default CouponItem;
