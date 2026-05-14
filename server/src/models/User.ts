import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  public password!: string;

  static initialize(sequelize: Sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
         role: {
          type: DataTypes.ENUM('user', 'admin'),
          defaultValue: 'user',
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        hooks: {
          beforeSave: async (user: any) => {
            if (user.changed('password')) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          },
        },
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Summary, {
      foreignKey: 'user_id',
      as: 'summaries',
    });

    this.hasMany(models.Review, {
      foreignKey: 'user_id',
      as: 'reviews',
    });

    this.hasMany(models.Message, {
      foreignKey: 'user_id',
      as: 'messages',
    });

    this.hasMany(models.Favorite, {
      foreignKey: 'user_id',
      as: 'favorites',
    });

    this.hasMany(models.PasswordResetToken, {
      foreignKey: 'user_id',
      as: 'passwordResetTokens',
    });

    this.hasMany(models.Book, {
      foreignKey: 'user_id',
      as: 'books',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

export default User;

export {};
