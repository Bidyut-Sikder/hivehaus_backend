import { Schema, model } from "mongoose";

import bcrypt from "bcrypt";
import { TUser } from "./auth.interfaces";

export const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    role: {
      type: String,
      enum: ["admin", "user"],
      message: "{VALUE} is not a valid user",
    },
    address: { type: String },
  },
  //prevents data from being printed out as object or json
  //but we can access password using user.password in auth.services.ts
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

//Before saving a User document to the database, the pre("save") middleware hashes the password using bcrypt.
userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(process.env.BCRYPT_SALT_ROUNDS)
  );
});

export const UserModel = model<TUser>("User", userSchema);
