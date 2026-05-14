import { Model, DataTypes, Sequelize } from 'sequelize';

class Message extends Model {
  static initialize(sequelize: Sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        subject: {
          type: DataTypes.STRING,
          allowNull: false
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'user_id'
        },
        reply: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        repliedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'replied_at'
        },
        isRead: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_read'
        }
      },
      {
        sequelize,
        modelName: 'Message',
        tableName: 'messages',
        underscored: true
      }
    );

    return this;
  }

  static associate(models: Record<string, any>) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

export default Message;

export {};
