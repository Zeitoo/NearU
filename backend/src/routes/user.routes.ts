import { Router } from "express";
import user from "../controller/user.controller";
import auth from "../middlewares/auth.middleware";
const router = Router();

router.get("/", (req, res) => {
	res.send("hi from user");
});

router.get("/search", auth.verifyJwt, user.searchName);

export default router;
