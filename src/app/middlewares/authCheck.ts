import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { UserModel } from "../modules/auth/auth.model";
import TryCatchError from "../utils/TryCatchError";

type TUserRole = 'admin' | 'user' ; // Define the TUserRole type
interface CustomRequest extends Request<ParamsDictionary, any, any, ParsedQs> {
  userId?: string;
}


const authCheck = (...requiredRoles: TUserRole[]) => {
  

  return TryCatchError(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You have no access to this route"
        );
      }

      const token = authHeader.split(" ")[1];

     
      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You have no access to this routee"
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      ) as JwtPayload;

      const { role, userId } = decoded;

      req.userId = userId;

      // checking if the user is exist
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
      }
      console.log(role)

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "You have no access to this route!"
        );
        // res.status(404).json({
        //   success: false,
        //   message: "You have no access to this route",
        // });
      }

      next();
    }
  );
};

export default authCheck;
