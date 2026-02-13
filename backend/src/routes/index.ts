import { Router } from "express";
import authRoutes from "./auth.routes";
import friendRoutes from "./friends.routes";
import userRoutes from "../routes/user.routes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/friends", friendRoutes);
router.use("/user", userRoutes);
router.get("/", (req, res) => {
	res.send("api");
});
export default router;
