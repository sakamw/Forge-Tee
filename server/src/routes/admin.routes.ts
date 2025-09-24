import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../middlewares/userMiddleware";
import { listFreelancerApplications, approveFreelancer, rejectFreelancer, listUsers, updateUserRole, setUserAdmin, setUserActive } from "../controllers/admin.controller";

const router = Router();

router.get("/freelancers/applications", authenticateJWT, authorizeAdmin, listFreelancerApplications);
router.post("/freelancers/:applicationId/approve", authenticateJWT, authorizeAdmin, approveFreelancer);
router.post("/freelancers/:applicationId/reject", authenticateJWT, authorizeAdmin, rejectFreelancer);

// Users management
router.get("/users", authenticateJWT, authorizeAdmin, listUsers);
router.patch("/users/:userId/role", authenticateJWT, authorizeAdmin, updateUserRole);
router.patch("/users/:userId/admin", authenticateJWT, authorizeAdmin, setUserAdmin);
router.patch("/users/:userId/active", authenticateJWT, authorizeAdmin, setUserActive);

export default router;
