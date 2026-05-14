declare module "../swagger" {
  import { Express } from "express";
  const setupSwagger: (app: Express) => void;
  export default setupSwagger;
}
