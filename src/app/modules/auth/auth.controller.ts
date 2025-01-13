import { Request, Response } from "express";

import { AuthService } from "./auth.services";
import TryCatchError from "../../utils/TryCatchError";

const createUser = TryCatchError(async (req: Request, res: Response) => {
  const result = await AuthService.createUserService(req.body);

  res.status(200).json({
    
    success: true,
    message: "User Registered successfully",
    data: result,
  });
});

const loginUser = console.log("d");
// async (req: Request, res: Response) => {
//     const result = await AuthService.loginUserIntoDB(req.body)
//     // const { user, token } = result

//     // res.cookie('token', `Bearer ${token}`, { httpOnly: true });
//     // res.cookie('token', token, { httpOnly: true });

//     res.status(200).json({
//         success: true,
//         message: 'User Logged in successfully',
//         data: result
//     })
// }

export const AuthController = {
  createUser,
  loginUser,
};
