import { Router } from "express";
import { authenticateJWT } from "../middlewares/userMiddleware";
import {
  getAdminOverview,
  getBuyerOrders,
  getFreelancerPortfolio,
  getMarketplaceDesigns,
} from "../controllers/dashboard.controller";

const router = Router();

router.get("/buyer/orders", authenticateJWT, getBuyerOrders);
router.get("/buyer/marketplace", authenticateJWT, getMarketplaceDesigns);
router.get("/freelancer/portfolio", authenticateJWT, getFreelancerPortfolio);
router.get("/admin/overview", authenticateJWT, getAdminOverview);

export default router;
