import { Schema, Types, model, type Document } from "mongoose";

interface IAssignment extends Document {
  assignmentId: Schema.Types.ObjectId;
  name: string;
  score: number;
}

interface IUsers extends Document {
  first: string;
  last: string;
  github: string;
  assignments: Schema.Types.ObjectId[];
}

const assignmentSchema = new Schema<IAssignment>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    name: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 4,
      default: "Unnamed assignment",
    },
    score: {
      type: Number,
      required: true,
      default: () => Math.floor(Math.random() * (100 - 70 + 1) + 70),
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

const userSchema = new Schema<IUsers>(
  {
    first: {
      type: String,
      required: true,
      max_length: 50,
    },
    last: {
      type: String,
      required: true,
      max_length: 50,
    },
    github: {
      type: String,
      required: true,
      max_length: 50,
    },
    assignments: [assignmentSchema],
  },
  {
    toJSON: {
      getters: true,
    },
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
