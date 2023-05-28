import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';
import { Order, User } from '../models';

@Table({ modelName: 'Address', tableName: 'address' })
class Address extends Model {
  // Associations
  @BelongsTo(() => User)
  user!: User;

  @HasOne(() => Order)
  order!: Order;

  // Columns
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'address_id',
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, field: 'user_mail' })
  userMail!: string;

  @Column({ type: DataType.BOOLEAN, field: 'active' })
  active!: boolean;

  @Column({ type: DataType.STRING, field: 'name' })
  name!: string;

  @Column({ type: DataType.INTEGER, field: 'province_id' })
  provinceId!: number;

  @Column({ type: DataType.STRING, field: 'province_name' })
  provinceName!: string;

  @Column({ type: DataType.INTEGER, field: 'district_id' })
  districtId!: number;

  @Column({ type: DataType.STRING, field: 'district_name' })
  districtName!: string;

  @Column({ type: DataType.STRING, field: 'ward_code' })
  wardCode!: string;

  @Column({ type: DataType.STRING, field: 'ward_name' })
  wardName!: string;

  @Column({ type: DataType.STRING, field: 'detail' })
  detail!: string;

  @Column({ type: DataType.STRING, field: 'phone_num' })
  phoneNum!: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default Address;
