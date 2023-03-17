import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  BelongsToMany,
  Default,
  BeforeValidate,
  BeforeCreate,
  AfterFind,
} from 'sequelize-typescript';
import { Role, UserToRole } from './';
import bcrypt from 'bcrypt';

@Table({ modelName: 'User', tableName: 'users' })
class User extends Model {
  // Association
  @BelongsToMany(() => Role, () => UserToRole)
  role?: Role;

  // Column
  @Column({ type: DataType.STRING, primaryKey: true })
  mail!: string;

  @Column({ type: DataType.TEXT })
  password!: string;

  @Column({ type: DataType.STRING, field: 'first_name' })
  firstName!: string;

  @Column({ type: DataType.STRING, field: 'last_name' })
  lastName!: string;

  @Default(
    'https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=170667a&w=0&k=20&c=m-F9Doa2ecNYEEjeplkFCmZBlc5tm1pl1F7cBCh9ZzM='
  )
  @Column({ type: DataType.TEXT, field: 'avatar' })
  avatar?: string;

  @Column({ type: DataType.STRING, field: 'phone_num' })
  phoneNum!: string;

  @Column({ type: DataType.DATE, field: 'date_of_birth' })
  dateOfBirth?: Date;

  @Default('')
  @Column({ type: DataType.TEXT, field: 'refresh_token' })
  refreshToken?: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt?: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt?: Date;

  // Hooks
  @BeforeValidate
  static makeLowerCase(instance: User) {
    console.log('makeLowerCase function called');
    instance.dataValues.mail = instance?.mail?.toLowerCase();
  }

  @BeforeCreate
  static async hashPassword(instance: User) {
    console.log('hashPassword function called');

    // Get password
    const password = instance.password;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Assign new password is hashed
    instance.dataValues.password = hashPassword;
  }
}

export default User;
