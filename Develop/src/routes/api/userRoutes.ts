import { Router } from "express";
const router = Router();
import {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  addFriend,
  removeFriend,
  updateUser,
} from "../../controllers/userController.js";

// /api/users
router.route("/").get(getUsers).post(createUser);

// /api/users/:userId
router.route("/:userId").get(getSingleUser).delete(deleteUser).put(updateUser);

// /api/users/:userId/assignments
router.route("/:userId/friend/:friendId").post(addFriend);

// /api/users/:userId/assignments/:assignmentId
router.route("/:userId/friend/:friendId").delete(removeFriend);

export { router as userRouter };
