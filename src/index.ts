import { config } from "dotenv";
config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { connect_db } from "./config/database";
import routes from "./routes";
import cookieParser from "cookie-parser";

const app: Express = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// DB CONNECTION
connect_db();

//Middlewares
app.use(
  cors({
    origin: process.env.HOST_URL || "*",
  }),
);

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
