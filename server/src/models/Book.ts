import { Model, DataTypes, Sequelize } from 'sequelize';

class Book extends Model {
  static initialize(sequelize: Sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        category: DataTypes.STRING,
        cover_url: DataTypes.STRING,
        status: DataTypes.STRING,
        slug: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        full_cover_url: {
          type: DataTypes.VIRTUAL,
          get() {
            try {
              const { SupabaseStorageService } = require('../services/SupabaseStorageService');
              const coverUrl = (this as any).cover_url;
              if (!coverUrl) return null;

              if (coverUrl.startsWith('/src/assets')) {
                return coverUrl;
              } else {
                const publicUrl = SupabaseStorageService.getPublicUrl(coverUrl);
                if (publicUrl) return publicUrl;

                // Try to build a public Supabase storage URL directly from SUPABASE_URL
                const rawSupabase = process.env.SUPABASE_URL;
                if (rawSupabase) {
                  const base = rawSupabase.replace(/^https?:\/\/db\./i, 'https://').replace(/\/+$/g, '');
                  const normalizedFilename = SupabaseStorageService.normalizeStorageFilename(coverUrl);
                  return `${base}/storage/v1/object/public/book-covers/${encodeURIComponent(normalizedFilename)}`;
                }

                const isLocalDevelopment =
                  process.env.NODE_ENV !== 'production' ||
                  process.env.APP_URL?.includes('localhost') ||
                  process.env.APP_URL?.includes('127.0.0.1');

                const backendUrl = isLocalDevelopment
                  ? 'http://localhost:3333'
                  : process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://papodelivro-backend.vercel.app');

                return `${backendUrl.replace(/\/+$|\s+$/g, '')}/files/${coverUrl}`;
              }
            } catch (error) {
              console.error('Error in full_cover_url getter:', error);
              return null;
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

