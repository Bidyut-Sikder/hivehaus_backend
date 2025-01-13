import { AnyZodObject } from "zod";

import { NextFunction, Request, Response } from "express";
import TryCatchError from "../utils/TryCatchError";

const requestValidator = (schema: AnyZodObject) => {
  return TryCatchError(
    async (req: Request, res: Response, next: NextFunction) => {
      await schema.parseAsync({ body: req.body });

      next();
    }
  );
};

export default requestValidator;
  