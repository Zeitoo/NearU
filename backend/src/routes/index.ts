import { Router } from "express";
import authRoutes from "./auth.routes";
import friendRoutes from "./friends.routes";
import userRoutes from "../routes/user.routes";
import locationRoutes from "../routes/location.routes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/friends", friendRoutes);
router.use("/user", userRoutes);
router.use("/locations", locationRoutes);
router.get("/", (req, res) => {
	res.status(200).json({ message: "Api online." });
});
export default router;
