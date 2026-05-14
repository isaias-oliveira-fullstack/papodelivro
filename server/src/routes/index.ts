import { Router, Request, Response } from "express";
import bookRoutes from "./bookRoutes";
import reviewRoutes from "./reviewRoutes";
import authRoutes from "./authRoutes";
import favoriteRoutes from "./favoriteRoutes";
import adminRoutes from "./adminRoutes";
import contactRoutes from "./contactRoutes";
import promptRoutes from "./promptRoutes";
import summaryRoutes from "./summaryRoutes";
import userRoutes from "./userRoutes";

const routes = Router();

routes.get('/', (_req: Request, res: Response) => {
  res.json({ message: "Bem-vindo(a) à API Papo de Livro!" });
});

routes.use('/auth', authRoutes);
routes.use(contactRoutes);
routes.use(promptRoutes);
routes.use('/books', bookRoutes);
routes.use(reviewRoutes);
routes.use('/favorites', favoriteRoutes);
routes.use('/admin', adminRoutes);
routes.use(userRoutes);
routes.use(summaryRoutes);

export default routes;