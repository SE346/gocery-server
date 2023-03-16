import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { User, UserToRole } from './';

@Table({ modelName: 'Role', tableName: 'role' })
class Role extends Model {
  // Association
  @BelongsToMany(() => User, () => UserToRole)
  users?: User[];

  // Column
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'role_id',
  })
  id?: number;

  @Column({ type: DataType.STRING, field: 'role_name' })
  roleName!: string;

  @Column({ type: DataType.STRING, field: 'role_description' })
  roleDescription?: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default Role;
