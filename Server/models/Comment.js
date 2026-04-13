import mongoose from "mongoose";
import Material from "./Material.js";
import { normalizeWhitespace } from "../utils/normalizeText.js";

const syncMaterialCommentCount = async (materialId) => {
  if (!materialId) {
    return;
  }

  const commentCount = await mongoose
    .model("Comment")
    .countDocuments({ material: materialId });

  await Material.findByIdAndUpdate(materialId, {
    commentsCount: commentCount,
  });
};

const CommentSchema = new mongoose.Schema(
  {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
      set: normalizeWhitespace,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

CommentSchema.index({ material: 1, createdAt: 1 });
CommentSchema.index({ author: 1, createdAt: -1 });

CommentSchema.post("save", async function () {
  await syncMaterialCommentCount(this.material);
});

CommentSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await syncMaterialCommentCount(doc.material);
  }
});

CommentSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await syncMaterialCommentCount(this.material);
  },
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
