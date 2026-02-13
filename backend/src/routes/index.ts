import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/auth", authRoutes);
router.get("/", (req, res) => {
	res.send("api");
});
export default router;
