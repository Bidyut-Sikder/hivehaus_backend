"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TryCatchError = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
        //checks there is any error occured in the fn function the the will throw the error
        //the error will be catched by the next() error function  and the error will be thrown
        //if we use this function here we do not need to use try--catch block in the api code.
    };
};
exports.default = TryCatchError;
