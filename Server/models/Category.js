import mongoose from "mongoose";
import { normalizeWhitespace } from "../utils/normalizeText.js";

const CategorySchema = new mongoose.Schema(
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

const Category = mongoose.model("Category", CategorySchema);

export default Category;
