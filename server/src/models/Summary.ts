import { Model, DataTypes, Sequelize } from 'sequelize';

class Summary extends Model {
  static initialize(sequelize: Sequelize) {
    super.init(
      {
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'PENDING',
        }
      },
      {
        sequelize,
        modelName: 'Summary',
        tableName: 'summaries',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Book, {
      foreignKey: 'book_id',
      as: 'book'
    });

    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

export default Summary;

export {};
