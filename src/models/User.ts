import mongoose, { model, Schema } from "mongoose";

interface IUser {
  id?: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  books_added: string[];
  role: string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  role: { type: String, enum: ["creator", "visitor", "admin"] },
  books_added: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});
const User = model<IUser>("User", UserSchema);

export { User, IUser };
