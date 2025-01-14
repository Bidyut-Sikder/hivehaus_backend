import { Request, Response } from "express";

import { AuthService } from "./auth.services";
import TryCatchError from "../../utils/TryCatchError";
import { createToken } from "./auth.utils";

const createUser = TryCatchError(async (req: Request, res: Response) => {
  const result = await AuthService.createUserService(req.body);
  const token = createToken(
    { userId: result.id, role: result.role },
    process.env.JWT_SECRET_KEY as string
  );

  res.cookie("token", token, { httpOnly: true });

  res.status(200).json({
    success: true,
    message: "User Registered successfully",
    data: result,
    token,
  });
});

const loginUser = TryCatchError(async (req: Request, res: Response) => {
  const result = await AuthService.loginUserService(req.body);
  const { user, token } = result

  res.cookie('token', token, { httpOnly: true });

  res.status(200).json({
    success: true,
    message: "User Logged in successfully",
    data: result,
  });
});

export const AuthController = {
  createUser,
  loginUser
};
