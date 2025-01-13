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

const loginUserService = async (payload: Partial<TUser>) => {
//   const { email, password } = payload;

//   if (!email || !password) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Email and password are required"
//     );
//   }

//   const user = await UserModel.findOne({ email }).select("+password");

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User is not found");
//   }

//   const isPasswordCorrect = await bcrypt.compare(
//     password as string,
//     user.password
//   );

//   if (!isPasswordCorrect) {
//     throw new AppError(httpStatus.FORBIDDEN, "Your Password is Incorrect");
//   }

//   const jwtPayload = {
//     userId: user._id.toString(),
//     role: user.role,
//   };
//   const token = createToken(jwtPayload, process.env.JWT_SECRET_KEY as string);

//   return { user, token };
};

export const AuthService = {
  loginUserService,
  createUserService,
};
