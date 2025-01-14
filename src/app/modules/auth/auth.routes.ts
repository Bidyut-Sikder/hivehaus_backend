import express from "express";
import { AuthController } from "./auth.controller";
import requestValidator from "../../middlewares/requestValidator";
import { userValidation } from "./auth.validations";

const router = express.Router();

router.post(
  "/signup",
  requestValidator(userValidation.userDataValidationSchema),
  AuthController.createUser
);

router.post(
  "/login",
  requestValidator(userValidation.userDataUpdateValidationSchema),
  AuthController.loginUser
);

export const authRouter = router;
 