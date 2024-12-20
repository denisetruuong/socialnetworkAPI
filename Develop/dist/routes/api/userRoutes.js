import { Router } from "express";
const router = Router();
import {
  getAllUsers,
  getUsersById,
  createUser,
  deleteUser,
  addAssignment,
  removeAssignment,
} from "../../controllers/userController.js";
// /api/students
router.route("/").get(getAllUsers).post(createUsers);
// /api/students/:studentId
router.route("/:studentId").get(getUserstById).delete(deleteUsers);
// /api/students/:studentId/assignments
router.route("/:studentId/assignments").post(addAssignment);
// /api/students/:studentId/assignments/:assignmentId
router.route("/:studentId/assignments/:assignmentId").delete(removeAssignment);
export { router as userRouter };
