import { Router } from "express";
import { authenticateJWT } from "../middlewares/userMiddleware";
import { getAdminOverview, getBuyerOrders, getFreelancerPortfolio } from "../controllers/dashboard.controller";

const router = Router();

router.get("/buyer/orders", authenticateJWT, getBuyerOrders);
router.get("/freelancer/portfolio", authenticateJWT, getFreelancerPortfolio);
router.get("/admin/overview", authenticateJWT, getAdminOverview);

export default router;
