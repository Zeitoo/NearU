import { Router } from "express";
import friends from "../controller/friends.controller";
import auth from "../middlewares/auth.middleware";
const router = Router();

router.get("/", auth.verifyJwt, friends.listFriends);
router.post("/add", auth.verifyJwt, friends.addFriends);
router.post("/block", auth.verifyJwt, friends.blockFriends);
router.post("/remove", auth.verifyJwt, friends.removeFriends);
router.post("/accept", auth.verifyJwt, friends.acceptFriends);
router.post("/reject", auth.verifyJwt, friends.rejectFriends);

export default router;
