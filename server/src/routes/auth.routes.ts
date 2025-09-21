import { Router } from "express";
import {
  verifyUserInfo,
  checkEmailAndUsernameReuse,
  verifyPassStrength,
} from "../middlewares/authMiddleware";
import {
  register,
  login,
  logout,
  updateUserPassword,
  forgotPassword,
  resetPassword,
  resendActivation,
  activateAccount,
} from "../controllers/auth.controller";
import { verifyNewPassStrength } from "../middlewares/newPassStrength";
import { authenticateJWT } from "../middlewares/userMiddleware";

const router: Router = Router();

router.post(
  "/register",
  verifyUserInfo,
  checkEmailAndUsernameReuse,
  verifyPassStrength,
  register
);
router.post("/login", login);
router.post("/logout", logout);
router.post(
  "/password",
  authenticateJWT,
  verifyNewPassStrength,
  updateUserPassword
);

router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:id/:token", resetPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.post("/resend-activation", resendActivation);
router.get("/activate/:id/:token", activateAccount);

export default router;
