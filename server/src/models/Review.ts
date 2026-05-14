import { Model, DataTypes, Sequelize } from 'sequelize';

class Review extends Model {
  static initialize(sequelize: Sequelize) {
    super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: { min: 1, max: 5 },
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        book_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        summary_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Review",
        tableName: "reviews",
        underscored: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.Book, { foreignKey: "book_id", as: "book" });
    this.belongsTo(models.Summary, { foreignKey: "summary_id", as: "summary" });
  }
}

export default Review;

export {};
