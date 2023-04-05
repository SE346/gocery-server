import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User, Role } from './';

@Table({ modelName: 'UserToRole', tableName: 'user_to_role' })
class UserToRole extends Model {
  // Columns
  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, primaryKey: true, field: 'user_mail' })
  userMail!: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, primaryKey: true, field: 'role_id' })
  roleId!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;
}

export default UserToRole;
