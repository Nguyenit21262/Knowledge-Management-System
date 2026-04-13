import mongoose from "mongoose";
import { normalizeWhitespace } from "../utils/normalizeText.js";

export const MATERIAL_TYPES = ["PDF", "VIDEO", "IMAGE"];

const MaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 160,
      set: normalizeWhitespace,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
      set: normalizeWhitespace,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
      index: true,
      set: normalizeWhitespace,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
      index: true,
      set: normalizeWhitespace,
    },
    type: {
      type: String,
      enum: MATERIAL_TYPES,
      required: true,
      uppercase: true,
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    contentText: {
      type: String,
      default: "",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

MaterialSchema.index({ subject: 1, category: 1, type: 1, createdAt: -1 });
MaterialSchema.index({ uploadedBy: 1, createdAt: -1 });
MaterialSchema.index({ createdAt: -1 });

const Material = mongoose.model("Material", MaterialSchema);

export default Material;
