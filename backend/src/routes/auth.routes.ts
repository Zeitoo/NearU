import { Router } from "express";
import auth from "../controller/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
const router = Router();

router.post("/login", authMiddleware.login, auth.login);
router.put("/register", authMiddleware.register, auth.register);
router.get("/refresh", auth.refresh);
router.patch("/changepass", authMiddleware.verifyJwt, auth.changePass);
router.post("/reset", auth.reset);
router.get("/activate", auth.activate);
router.delete("/logout", auth.logout);
router.delete("/deleteaccount", authMiddleware.verifyJwt, auth.deleteAccount);

export default router;
