import { Router } from "express";
import auth from "../middlewares/auth.middleware";
import { updateLocationPermission } from "../controller/location.controller";
const router = Router();

router.patch("/", auth.verifyJwt, updateLocationPermission);

export default router;
