
import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { roomRoutes } from "../modules/room/room.routes";
import { slotRoutes } from "../modules/slots/slot.routes";


const router = Router();

router.use('/auth',authRouter)
router.use('/rooms',roomRoutes)
router.use('/slots',slotRoutes)



export default router;
