
import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { roomRoutes } from "../modules/room/room.route";


const router = Router();

router.use('/auth',authRouter)
router.use('/rooms',roomRoutes)



export default router;
