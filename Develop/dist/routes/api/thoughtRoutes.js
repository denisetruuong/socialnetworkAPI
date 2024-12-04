import { Router } from "express";
const router = Router();
import {
  getAllCourses,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
} from "../../controllers/thoughtController.js";
// /api/courses
router.route("/").get(getAllThought).post(createThought);
// /api/courses/:courseId
router
  .route("/:thoughtId")
  .get(getThoughtsById)
  .put(updateThought)
  .delete(deleteThought);
export { router as thoughtRouter };
