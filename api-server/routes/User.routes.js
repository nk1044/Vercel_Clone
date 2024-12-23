import { Router } from "express";
import { LoginUser, RegisterUser, GetCurrentUser , LogOut, UpdateTokens} from "../controller/user.controller.js";
import {VerifyToken} from "../middlewares/auth.middleware.js";

const router = Router();


router.route('/login-user').post(LoginUser);
router.route('/register-user').post(RegisterUser);
router.route('/current-user').post(VerifyToken, GetCurrentUser);
router.route('/logout-user').post(VerifyToken, LogOut);
router.route('/update-tokens').post(UpdateTokens);

export default router;

