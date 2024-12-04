import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { User, Thoughts } from "../models/index.js";

export const headCount = async () => {
  const numberOfUsers = await User.aggregate().count("userCount");
  return numberOfUsers;
};

// Aggregate function for getting the overall grade using $avg
export const grade = async (userId: string) =>
  User.aggregate([
    // only include the given user by using $match
    { $match: { _id: new ObjectId(userId) } },
    {
      $unwind: "$assignments",
    },
    {
      $group: {
        _id: new ObjectId(userId),
        overallGrade: { $avg: "$assignments.score" },
      },
    },
  ]);

/**
 * GET All Users /users
 * @returns an array of Users
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const user = await User.find();

    const userObj = {
      user,
      headCount: await headCount(),
    };

    res.json(userObj);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET User based on id /users/:id
 * @param string id
 * @returns a single User object
 */
export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.json({
        user,
        grade: await grade(userId),
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * POST User /users
 * @param object user
 * @returns a single User object
 */

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
/**
 * DELETE User based on id /users/:id
 * @param string id
 * @returns string
 */

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: "No such user exists" });
    }

    const thought = await Thoughts.findOneAndUpdate(
      { users: req.params.userId },
      { $pull: { users: req.params.userId } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({
        message: "User deleted, but no thoughts found",
      });
    }

    return res.json({ message: "User successfully deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

/**
 * POST Assignment based on /users/:userId/assignments
 * @param string id
 * @param object assignment
 * @returns object user
 */

export const addFriend = async (req: Request, res: Response) => {
  console.log("You are adding a Friend");
  console.log(req.body);
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user found with that ID :(" });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

/**
 * DELETE Assignment based on /users/:userId/assignments
 * @param string assignmentId
 * @param string userId
 * @returns object user
 */

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: { friendId: req.params.friendId } } },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user found with that ID :(" });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// * PUT Course based on id /courses/:id
// * @param object id, username
// * @returns a single Course object

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user with this id!" });
    }

    return res.json(user);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
