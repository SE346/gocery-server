import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Category, ProductImg } from '../models';

@Table({ modelName: 'Product', tableName: 'product' })
class Product extends Model {
  // Column
  @Column({
    type: DataType.TEXT,
    primaryKey: true,
    field: 'product_id',
  })
  id!: number;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, field: 'category_id' })
  categoryId!: number;

  @BelongsTo(() => Category)
  category!: Category;

  @HasMany(() => ProductImg)
  productImgList!: ProductImg[];

  @Column({ type: DataType.STRING, field: 'name' })
  productName!: string;

  @Column({ type: DataType.TEXT, field: 'description' })
  productDescription?: string;

  @Column({ type: DataType.INTEGER, field: 'price' })
  price!: number;

  @Column({ type: DataType.INTEGER, field: 'discount' })
  discount?: number;

  @Column({ type: DataType.STRING, field: 'unit' })
  unit!: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default Product;
