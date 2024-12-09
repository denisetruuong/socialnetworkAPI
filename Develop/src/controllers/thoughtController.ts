import { Request, Response } from "express";
import { User, Thoughts } from "../models/index.js";

export const getThoughts = async (_req: Request, res: Response) => {
  try {
    const thoughts = await Thoughts.find();
    res.json(thoughts);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thoughts.create(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thoughts: thought._id } },
      { new: true }
    );

    if (!user) {
      res
        .status(404)
        .json({ message: "thought created, but found no user with that ID" });
    }
    res.json("Created the thought");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
    return;
  }
};

export const getSingleThoughts = async (req: Request, res: Response) => {
  try {
    const thought = await Thoughts.findOne({
      _id: req.params.thoughtId,
    }).populate("reactions");
    if (!thought) {
      res.status(400).json({ message: "No thought with this id" });
    } else {
      res.json(thought);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateThought = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const thought = await Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId }, //does thoughtId need to match something??? I had thoughtsId
      { $set: req.body },
      { runValidators: true, new: true }
    );
    if (!thought) {
      res.status(404).json({ message: "No thought with this id!" });
    }
    res.json(thought);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteThought = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const thought = await Thoughts.findOneAndDelete({
      _id: req.params.thoughtId,
    });
    if (!thought) {
      res.status(404).json({ message: "No thought with this id" });
    }
    if (!thought) {
      res.status(404).json({
        message: "Thought created but no user with this id!",
      });
    }
    res.json({ message: "Thought successfully deleted!" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const addReaction = await Thoughts.findByIdAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    );
    if (!addReaction) {
      res.status(404).json({ message: "No thought with this id" });
    }
    res.json(addReaction);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const thought = await Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { runValidators: true, new: true }
    );
    if (!thought) {
      res.status(404).json({ message: "No reaction found with that ID" });
    }
    res.json(thought);
  } catch (error) {
    res.status(500).json(error);
  }
};
