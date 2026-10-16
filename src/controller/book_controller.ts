import { Request, Response } from "express";
import { Book, IBook } from "../models/Book";

export interface IResponse {
  success: boolean;
  message: string;
  error?: any;
  data?: any;
}

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books found",
        data: [],
      } as IResponse);
    }

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: books,
    } as IResponse);
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    } as IResponse);
  }
};

export const add_book = async (req: Request, res: Response) => {
  if (req.role !== "creator") {
    return res.status(403).json({
      success: false,
      message: "Access Denied",
    } as IResponse);
  }
  const { name, author, description, publishYear }: IBook = req.body;
  try {
    const book = await Book.create({
      name: name,
      author: author,
      description: description,
      publishYear: publishYear,
    });
    return res.status(200).json({
      success: true,
      message: "book created",
      data: book,
    } as IResponse);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    } as IResponse);
  }
};

export const update_book = async (req: Request, res: Response) => {
  if (req.role !== "creator") {
    return res.status(403).json({
      success: false,
      message: "Access Denied",
    } as IResponse);
  }
  const { id } = req.params;
  const { name, author, description, publishYear }: Partial<IBook> = req.body;

  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { name, author, description, publishYear },
      {
        new: true,
        runValidators: true,
      },
    ).exec();

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      } as IResponse);
    }

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    } as IResponse);
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    } as IResponse);
  }
};

export const delete_book = async (req: Request, res: Response) => {
  if (req.role !== "creator") {
    return res.status(403).json({
      success: false,
      message: "Access Denied",
    } as IResponse);
  }
  const { id } = req.params;
  try {
    const data = await Book.findByIdAndDelete(id).exec();
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "book not found",
      } as IResponse);
    }
    return res.status(200).json({
      success: false,
      message: "book successfully deleted",
    } as IResponse);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    } as IResponse);
  }
};
