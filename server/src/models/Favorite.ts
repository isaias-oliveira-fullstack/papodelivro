import { Model, DataTypes, Sequelize } from 'sequelize';

class Favorite extends Model {
  public id!: number;
  public user_id!: number;
  public book_id!: number;

  static initialize(sequelize: Sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        book_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Favorite',
        tableName: 'favorites',
        underscored: true,
        timestamps: true,
      }
    );

    return this;
  }

  static associate(models: Record<string, any>) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Book, { foreignKey: 'book_id', as: 'book' });
  }
}

export default Favorite;
