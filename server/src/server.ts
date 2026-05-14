import 'dotenv/config';
import app from './app';
import db from './models';

const { sequelize } = db;

const PORT = Number(process.env.PORT || process.env.APP_PORT) || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error: unknown) {
    console.error('Falha ao conectar com o banco de dados:', error);
    process.exit(1);
  }
}

startServer();

