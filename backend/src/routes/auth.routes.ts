import { Router } from "express";
import auth from "../controller/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

import passport from "../configs/passport.config";
const router = Router();

router.post("/login", authMiddleware.login, auth.login);
router.post("/register", authMiddleware.register, auth.register);
router.get("/refresh", auth.refresh);
router.patch("/changepass", authMiddleware.verifyJwt, auth.changePass);
router.delete("/logout", auth.logout);
router.post("/deleteaccount", authMiddleware.verifyJwt, auth.deleteAccount);

// Inicia o fluxo Google
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		session: false,
	})
);

// Callback após autenticação Google
router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login",
		session: false,
	}),
	auth.googleCallback
);

export default router;
