import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/signup", AuthController.createUser);

export const authRouter = router;
