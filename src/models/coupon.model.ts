import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import CouponItem from './couponItem';

@Table({ modelName: 'Coupon', tableName: 'coupon' })
class Coupon extends Model {
  // Associations
  @HasMany(() => CouponItem)
  couponItemList!: CouponItem[];

  // Columns
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true, field: 'coupon_id' })
  id!: number;

  @Column({ type: DataType.DATE, field: 'from_date' })
  fromDate!: Date;

  @Column({ type: DataType.DATE, field: 'end_date' })
  endDate!: Date;

  @Column({ type: DataType.STRING, field: 'coupon_type' })
  couponType!: string;

  @Column({ type: DataType.INTEGER, field: 'discount' })
  discount!: number;

  @Column({ type: DataType.FLOAT, field: 'price_point_accept' })
  pricePointAccept!: number;

  @Column({ type: DataType.INTEGER, field: 'quantity' })
  quantity!: number;

  @Column({ type: DataType.STRING, field: 'description' })
  description!: string;

  @Column({ type: DataType.TEXT, field: 'thumbnail' })
  thumbnail!: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default Coupon;
