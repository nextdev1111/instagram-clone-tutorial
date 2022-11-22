import { Router } from "express";
import {
  emailVerificationComplete,
  emailVerificationRequest,
  forgotPasswordComplete,
  forgotPasswordRequest,
  getUserDetails,
  loginUser,
  registerUser,
  updateUserDetails,
} from "../controllers/userControllers";
import authVerify from "../middlewares/authVerify";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// details
router.get("/details", authVerify(), getUserDetails);
router.put("/details", authVerify(), updateUserDetails);
// email verification
router.post("/email-verify", authVerify(), emailVerificationRequest);
router.put("/email-verify", authVerify(), emailVerificationComplete);
// reset password
router.post("/password-reset", forgotPasswordRequest);
router.put("/password-reset", forgotPasswordComplete);

export default router;
