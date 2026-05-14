import { Request, Response, Router } from "express";
import authMiddleware from "../middlewares/auth";

const routes = Router();

/**
 * @swagger
 * tags:
 *   - name: CheckAuthRoutes
 *     description: Checagem de autenticação.
 */

/**
 * @swagger
 * /check-auth:
 *   get:
 *     summary: Verifica token de autenticação.
 *     tags: [CheckAuthRoutes]
 *     responses:
 *       200:
 *         description: OK
 */
routes.get("/check-auth", authMiddleware, (req: Request, res: Response) => {
  return res.status(200).json({ message: "Token válido" });
});

export default routes;
