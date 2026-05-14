import { Model, DataTypes, Sequelize } from 'sequelize';

class PasswordResetToken extends Model {
  public id!: number;
  public token_hash!: string;
  public user_id!: number;
  public expires_at!: Date;
  public used_at!: Date | null;

  static initialize(sequelize: Sequelize) {
    super.init(
      {
        token_hash: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        used_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'PasswordResetToken',
        tableName: 'password_reset_tokens',
        underscored: true,
        timestamps: true,
      }
    );

    return this;
  }

  static associate(models: any) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default PasswordResetToken;
