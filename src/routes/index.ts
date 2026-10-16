import { Router } from "express";
import { bookRouter } from "./book_route";
import authRouter from "./auth.route";

const routes = Router();

routes.use("/book", bookRouter);
routes.use("/auth", authRouter);

export default routes;
