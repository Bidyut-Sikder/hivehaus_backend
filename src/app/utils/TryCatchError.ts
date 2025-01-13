import { NextFunction, Request, RequestHandler, Response } from "express";


const TryCatchError = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    //checks there is any error occured in the fn function the the will throw the error
    //the error will be catched by the next() error function  and the error will be thrown
    //if we use this function here we do not need to use try--catch block in the api code.
  };
};
export default TryCatchError;
