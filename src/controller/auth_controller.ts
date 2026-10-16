import { config } from "dotenv";
config();
import { Request, Response } from "express";
import { IResponse } from "./book_controller";
import { IUser, User } from "../models/User";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, phone, username, role }: IUser = req.body;
  try {
    if (!name || !email || !phone || !username || !role || !password) {
      return res.status(400).json({
        message: "fields are missing",
        success: false,
        data: null,
      } as IResponse);
    }
    let user: IUser | null;
    user = await User.findOne({ email: email });
    if (user) {
      return res.status(200).json({
        message: "user already registered . please log in",
        success: false,
      } as IResponse);
    }
    const saltRounds: number = 10;
    const hashed_password = await bcrypt.hash(password, saltRounds);
    user = await User.create({
      name,
      email,
      password: hashed_password,
      phone,
      username,
      role,
    });
    return res.status(200).json({
      success: true,
      message: "User Successfully Registered",
      data: user,
    } as IResponse);
  } catch (error: any) {
    return res.status(500).json({
      message: "internal server error",
      success: false,
      error: error.message,
    } as IResponse);
  }
};
export const login = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    if ((!username && !email) || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Enter valid details",
      } as IResponse);
    }

    const user: IUser | null = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "invalid credentials",
        data: user,
      } as IResponse);
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "invalid credentials",
      });
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as Secret, {
      expiresIn: "2hr",
    });

    return res
      .status(200)
      .cookie("token", token)
      .json({
        success: true,
        message: "logged in",
        data: user,
      } as IResponse);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    } as IResponse);
  }
};
