import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { createToken } from "./auth.utils";
import { TUser } from "./auth.interfaces";
import { UserModel } from "./auth.model";
import AppError from "../../errors/AppError";

const createUserService = async (payload: TUser) => {
  const result = await UserModel.create(payload);
  return result;
};


export const AuthService = {

  createUserService,
};
