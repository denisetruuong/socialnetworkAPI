import { Router } from "express";
const router = Router();
import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  addFriend,
  removeFriend,
  updateUser,
} from "../../controllers/userController.js";

// /api/users
router.route("/").get(getAllUsers).post(createUser);

// /api/users/:userId
router.route("/:userId").get(getUserById).delete(deleteUser).put(updateUser);

// /api/users/:userId/assignments
router.route("/:userId/friend/:friendId").post(addFriend);

// /api/users/:userId/assignments/:assignmentId
router.route("/:userId/friend/:friendId").delete(removeFriend);

export { router as userRouter };
