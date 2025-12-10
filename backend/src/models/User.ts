import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: "admin" | "editor";
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "editor" }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const User = mongoose.model<IUser>("User", userSchema);
