import { Request, Response } from "express";
import { Thoughts, User } from "../models/index.js";

/**
 * GET All Courses /courses
 * @returns an array of Courses
 */
export const getAllThoughts = async (_req: Request, res: Response) => {
  try {
    const thoughts = await Thoughts.find();
    res.json(thoughts);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET Course based on id /course/:id
 * @param string id
 * @returns a single Course object
 */
export const getThoughteById = async (req: Request, res: Response) => {
  const { thoughtId } = req.params;
  try {
    const user = await Thoughts.findById(thoughtId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        message: "Volunteer not found",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * POST Course /courses
 * @param object username
 * @returns a single Course object
 */
export const createThought = async (req: Request, res: Response) => {
  const { thought } = req.body;
  try {
    const newThought = await Thoughts.create({
      thought,
    });
    res.status(201).json(newThought);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * PUT Course based on id /courses/:id
 * @param object id, username
 * @returns a single Course object
 */
export const updateThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thoughts.findOneAndUpdate(
      { _id: req.params.courseId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!thought) {
      res.status(404).json({ message: "No thought with this id!" });
    }

    res.json(thought);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * DELETE Course based on id /courses/:id
 * @param string id
 * @returns string
 */
export const deleteThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thoughts.findOneAndDelete({
      _id: req.params.thoughtId,
    });

    if (!thought) {
      res.status(404).json({
        message: "No thought with that ID",
      });
    } else {
      await User.deleteMany({ _id: { $in: thought.user } });
      res.json({ message: "Thought and user deleted!" });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
