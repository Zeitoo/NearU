import { Router } from "express";
import user from "../controller/user.controller";
const router = Router();

router.get("/", (req, res) => {
	res.send("hi from user");
});

router.get("/search", user.searchName);

export default router;
