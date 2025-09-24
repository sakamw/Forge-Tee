import { Router } from "express";
import { authenticateJWT } from "../middlewares/userMiddleware";
import { applyForFreelancer, getMyFreelancerApplication } from "../controllers/freelancers.controller";

const router = Router();

router.post("/apply", authenticateJWT, applyForFreelancer);
router.get("/application", authenticateJWT, getMyFreelancerApplication);

export default router;
