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
import { Product } from '../models';

@Table({ modelName: 'ProductImg', tableName: 'product_img' })
class ProductImg extends Model {
  // Column
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'product_img_id',
  })
  id!: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.TEXT, field: 'product_id' })
  productId!: string;

  @BelongsTo(() => Product)
  product!: Product;

  @Column({ type: DataType.TEXT, field: 'img_url' })
  imgUrl!: string;

  @Column({ type: DataType.INTEGER, field: 'index' })
  index!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default ProductImg;
