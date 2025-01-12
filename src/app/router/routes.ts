
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    name: "hello from workspace API router",
    version: "1.0.0",
    description: "API for room booking",
  });
});



export default router;
