// src/models/Book.js (Versão Corrigida FINAL para full_cover_url como DataTypes.VIRTUAL)

import { Model, DataTypes, Sequelize } from 'sequelize';

class Book extends Model {
  static initialize(sequelize: Sequelize) {
    super.init(
      {
        id: { // Adicionado id para garantir que está sempre presente
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        category: DataTypes.STRING,
        cover_url: DataTypes.STRING, // Este campo armazena o nome do arquivo OU o caminho relativo do mock
        status: DataTypes.STRING,
        slug: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        // CORREÇÃO CRÍTICA AQUI: Definir 'full_cover_url' como um campo VIRTUAL
        full_cover_url: {
          type: DataTypes.VIRTUAL,
          get() {
            const coverUrl = (this as any).cover_url;
            if (!coverUrl) return null;

            // Se cover_url for um caminho relativo (do mockdata, ex: "/src/assets/...")
            if (coverUrl.startsWith('/src/assets')) {
              return coverUrl; // Retorna o caminho relativo diretamente
            } 
            // Caso contrário, assume que é um nome de arquivo de upload e monta a URL completa
            else {
              // process.env.APP_URL deve ser o URL base do seu backend (ex: https://papodelivro-backend.onrender.com)
              const backendUrl = (process.env.APP_URL ?? 'http://localhost:3333').replace(/\/+$/, '');
            return `${backendUrl}/files/${coverUrl}`;
            }
          }
        }
      },
      {
        sequelize,
        tableName: "books",
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        modelName: "Book",
        // REMOVIDO: O objeto 'getters' separado não é mais necessário para 'full_cover_url'
        // pois ele foi definido como um DataTypes.VIRTUAL diretamente nos atributos.
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Summary, {
      foreignKey: 'book_id',
      as: 'summaries',
    });
    this.hasMany(models.Review, {
      foreignKey: 'book_id',
      as: 'reviews',
    });
    this.hasMany(models.Favorite, {
      foreignKey: 'book_id',
      as: 'favorites',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default Book;

