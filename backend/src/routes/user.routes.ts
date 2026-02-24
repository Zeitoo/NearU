import { Router } from "express";
import user from "../controller/user.controller";
import auth from "../middlewares/auth.middleware";
const router = Router();

router.get("/search", auth.verifyJwt, user.searchName);
router.patch("/profile", auth.verifyJwt, user.updateProfileImg);
router.post("/", user.getUser)
export default router;
