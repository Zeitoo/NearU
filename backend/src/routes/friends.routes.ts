import { Router } from "express";
import friends from "../controller/friends.controller";
import auth from "../middlewares/auth.middleware";
const router = Router();

router.get("/", auth.verifyJwt, friends.listFriends);
router.put("/add", auth.verifyJwt, friends.addFriends);
router.post("/block", auth.verifyJwt, friends.blockFriends);
router.delete("/unblock", auth.verifyJwt, friends.unblockUser);
router.delete("/remove", auth.verifyJwt, friends.removeFriends);
router.put("/accept", auth.verifyJwt, friends.acceptFriends);
router.post("/reject", auth.verifyJwt, friends.rejectFriends);

export default router;
