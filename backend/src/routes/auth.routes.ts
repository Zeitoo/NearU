import { Router } from "express";
import auth from "../controller/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
const router = Router();

router.get("/", (req, res) => {
	res.send("hi from auth");
});

router.post("/login", authMiddleware.login, auth.login);
router.post("/register", authMiddleware.register, auth.register);
router.get("/refresh", auth.refresh)
router.post("/reset", auth.reset);
router.get("/activate", auth.activate);
router.delete("/logout", auth.logout);
router.get("/test", auth.test);
export default router;
