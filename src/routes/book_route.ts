import { Router } from "express";
import { add_book, getBooks, update_book } from "../controller/book_controller";
import { auth } from "../config/middleware/auth.middleware";
export const bookRouter = Router();

bookRouter.get("/get-books", getBooks);
bookRouter.post("/add-book", auth, add_book);
bookRouter.post("/update_book/:id", auth, update_book);
bookRouter.post("/delete-book/:id", add_book);
