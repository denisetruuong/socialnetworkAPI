import { Router } from "express";
const router = Router();
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser.
  getFriends,
  addFriend,
  getFriendById,
  deleteFriend,
} from "../../controllers/userController.js";

// /api/users
router.route("/").get(getUsers).post(createUser);

// /api/user/:userId
router.route("/:userId").get(getUserbyId).put(updateUser).delete(deleteUser);

// /api/user/:userId/friends
router.route("/:userId/friends").get(getFriends).post(addFriend);

// /api/user/:userID/friends/:friendID
router
  .route("/api/users/:userId/friends/:friendId")
  .get(getFriendByID)
  .delete(deleteFriend);

export { router as userRouter };
