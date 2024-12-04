import { User, Thoughts } from "../models/index.js";
import { ObjectId } from "mongodb";
// TODO: Create an aggregate function to get the number of students overall
export const headCount = async () => {
  // Your code here
  const numberOfUsers = await User.aggregate().count("userCount");
  return numberOfUsers;
};
// Aggregate function for getting the overall grade using $avg
export const grade = async (UserId) =>
  User.aggregate([
    // TODO: Ensure we include only the student who can match the given ObjectId using the $match operator
    { $match: { _id: ObjectId(UserId) } },
    // Your code here
    // Your code here
    {
      $unwind: "$assignments",
    },
    // TODO: Group information for the student with the given ObjectId alongside an overall grade calculated using the $avg operator

    $group,
    {
      _id: new ObjectId(userId),
      overallGrade: { $avg: "$assignments.grade" },
      // Your code here
    },
  ]);
/**
 * GET All Students /students
 * @returns an array of Students
 */
export const getAllUsers = async (_req, res) => {
  try {
    const users = await Users.find();
    const usersObj = {
      users,
      headCount: await headCount(),
    };
    res.json(studentObj);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
/**

 * @param string id
 * @returns a single User object
 */
export const getUserById = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
/**

 * @param object user
 * @returns a single User object
 */
export const createStudent = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
/**
 * DELETE Student based on id /students/:id
 * @param string id
 * @returns string
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.userId,
    });
    if (!user) {
      return res.status(404).json({ message: "No such user exists" });
    }
    const course = await Course.findOneAndUpdate(
      { user: req.params.userId },
      { $pull: { user: req.params.userId } },
      { new: true }
    );
    if (!course) {
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
 * POST Assignment based on /students/:studentId/assignments
 * @param string id
 * @param object assignment
 * @returns object student
 */
export const addAssignment = async (req, res) => {
  console.log("You are adding an assignment");
  console.log(req.body);
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { assignments: req.body } },
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
 * DELETE Assignment based on /students/:studentId/assignments
 * @param string assignmentId
 * @param string studentId
 * @returns object student
 */
export const removeAssignment = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { assignments: { assignmentId: req.params.assignmentId } } },
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
