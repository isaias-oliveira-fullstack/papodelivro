import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import multerConfig from "./config/multer";
let allRoutes: any;
let setupSwagger: any;

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const baseEnvFile = path.resolve(process.cwd(), ".env");

dotenv.config({ path: baseEnvFile });

const envFile = path.resolve(
  process.cwd(),
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"
);

dotenv.config({ path: envFile, override: true });

const db: any = require("./models");
const { sequelize } = db;
// carregar rotas e swagger apenas após dotenv e models estarem prontos
allRoutes = require("./routes").default;
setupSwagger = require("./swagger").default;

class App {
  public server: express.Express;

  constructor() {
    this.server = express();

    this.securityMiddlewares();
    this.middlewares();
    this.routes();
  }

  securityMiddlewares() {
    this.server.set("trust proxy", true);

    // Configurar origens permitidas dinamicamente
    const getAllowedOrigins = () => {
      const baseOrigins = [
        "https://papodelivro.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://localhost:8081", // Expo
      ];

      // Adicionar domínios de produção via variáveis de ambiente
      if (process.env.FRONTEND_URL) {
        baseOrigins.push(process.env.FRONTEND_URL);
      }

      // Suportar múltiplos domínios separados por vírgula
      if (process.env.ALLOWED_ORIGINS) {
        baseOrigins.push(...process.env.ALLOWED_ORIGINS.split(","));
      }

      return baseOrigins;
    };

    const allowedOrigins = getAllowedOrigins();

    this.server.use(
      cors({
        origin: (origin, callback) => {
          // Requisições sem origin (como mobile apps ou ferramentas CLI)
          if (!origin) return callback(null, true);

          // Em desenvolvimento, permitir qualquer origem
          if (process.env.NODE_ENV === "development") {
            return callback(null, true);
          }

          // Em produção, verificar lista de origens permitidas
          if (allowedOrigins.some(allowed => {
            // Fazer comparação tolerante com variações de protocolo
            return origin === allowed || 
                   origin.replace(/^https?:/, "") === allowed.replace(/^https?:/, "");
          })) {
            callback(null, true);
          } else {
            console.warn(`⚠️ CORS bloqueado para origem: ${origin}`);
            callback(new Error("Not allowed by CORS"));
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        credentials: true,
        optionsSuccessStatus: 200,
        maxAge: 86400, // 24 horas - tempo de cache da preflight
      })
    );
  }

  middlewares() {
    this.server.use(express.json({ limit: "10mb" }));
    this.server.use(express.urlencoded({ extended: true }));

    this.server.use(
      "/files",
      express.static(multerConfig.uploadDir, {
        setHeaders: (res) => {
          res.set("Access-Control-Allow-Origin", "*");
        },
      })
    );
  }

  routes() {
    this.server.get("/api/health", async (req: Request, res: Response) => {
      try {
        await sequelize.authenticate();
        res.status(200).json({
          status: "healthy",
          database: "connected",
          timestamp: new Date().toISOString(),
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(503).json({ status: "unavailable", error: message });
      }
    });

    this.server.get("/health-check", async (req: Request, res: Response) => {
      try {
        await sequelize.authenticate();
        res.status(200).json({
          status: "healthy",
          database: "connected",
          timestamp: new Date().toISOString(),
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(503).json({ status: "unavailable", error: message });
      }
    });

    this.server.get("/", (req: Request, res: Response) => {
      res.json({ message: "Papo de Livro API", status: "operational" });
    });

    setupSwagger(this.server);
    this.server.use("/api", allRoutes);

    // Handler para rotas API não encontradas - deve vir APÓS todas as rotas da API
    this.server.use("/api", (req: Request, res: Response) => {
      console.log(`🔍 Rota não encontrada: ${req.method} ${req.path}`);
      res.status(404).json({ error: "Rota não encontrada." });
    });

    this.server.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error("Global error handler:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      res.status(err.status || 500).json({
        error: {
          message: errorMessage,
          details: process.env.NODE_ENV === "development" ? err.stack : undefined,
        },
      });
    });
  }
}

const server = new App().server;
export default server;
module.exports = server;