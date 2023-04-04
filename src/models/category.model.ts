import { Table, Column, Model, CreatedAt, UpdatedAt, DataType } from 'sequelize-typescript';

@Table({ modelName: 'Category', tableName: 'category' })
class Category extends Model {
  // Column
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'category_id',
  })
  id!: number;

  @Column({ type: DataType.STRING, field: 'category_name' })
  categoryName!: string;

  @Column({ type: DataType.STRING, field: 'category_image' })
  categoryImage!: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default Category;
