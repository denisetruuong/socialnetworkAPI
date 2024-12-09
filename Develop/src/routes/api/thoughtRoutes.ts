import { Router } from "express";
const router = Router();
import {
  getThoughts,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
} from "../../controllers/thoughtController.js";

// /api/thoughts
router.route("/").get(getThoughts).post(createThought);

// /api/thoughts/:thoughtId
router
  .route("/:thoughtId")
  .get(getThoughts) // Replace getThoughtById with getThoughts
  .put(updateThought)
  .delete(deleteThought);

router.route("/:thoughtId/reactions").post(createReaction);

router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

export { router as thoughtRouter };
