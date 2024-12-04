import { Thought, User } from "../models/index.js";
const cleanDB = async () => {
  try {
    await Thought.deleteMany({});
    console.log("Thought collection cleaned.");
    await Users.deleteMany({});
    console.log("User collection cleaned.");
  } catch (err) {
    console.error("Error cleaning collections:", err);
    process.exit(1);
  }
};
export default cleanDB;
