import mongoose from "mongoose";
import { normalizeWhitespace } from "../utils/normalizeText.js";

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
      set: normalizeWhitespace,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Subject = mongoose.model("Subject", SubjectSchema);

export default Subject;
