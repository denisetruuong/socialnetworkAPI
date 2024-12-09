import User from "../models/User.js";
import { Request, Response } from "express";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("thoughts")
      .populate("friends");

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user data", error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = await User.create(req.body);
    res.json(userData);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    // Update user with the new data
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });
    if (!user) {
      res.status(404).json({ message: "No thought with this id" });
    }
    if (!user) {
      res.status(404).json({
        message: "User created but no user with this id!",
      });
    }
    res.json({ message: "User successfully deleted!" });
    return;
  } catch (error) {
    res.status(500).json(error);
    return;
  }
};

export const addFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, friendId } = req.params;

    if (userId === friendId) {
      res.status(400).json({ message: " You cannot add yourself as a friend" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } },
      { new: true, runValidators: true }
    ).populate("friends");
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const friend = await User.findByIdAndUpdate(
      friendId,
      { $addToSet: { friends: userId } },
      { new: true, runValidators: true }
    ).populate("friends");
    if (!friend) {
      res.status(404).json({ message: "Friend not found." });
    }
    res
      .status(200)
      .json({ message: "Friend added successfully!", user, friend });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    ).populate("friends");
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const friend = await User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: userId } },
      { new: true }
    ).populate("friends");
    if (!friend) {
      res.status(404).json({ message: "Friend not found" });
    }
    res.status(200).json({ message: "Friend removed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
