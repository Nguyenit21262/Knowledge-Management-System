import mongoose from "mongoose";

const syncMaterialCommentCount = async (materialId) => {
  if (!materialId) {
    return;
  }

  const Material = mongoose.model("Material");
  const Comment = mongoose.model("Comment");
  const commentsCount = await Comment.countDocuments({ material: materialId });

  await Material.findByIdAndUpdate(materialId, { commentsCount });
};

const commentSchema = new mongoose.Schema(
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
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true, versionKey: false },
);

commentSchema.index({ material: 1, parent: 1, createdAt: 1 });
commentSchema.index({ author: 1, createdAt: -1 });

commentSchema.post("save", async function handleAfterSave() {
  await syncMaterialCommentCount(this.material);
});

commentSchema.post("findOneAndDelete", async function handleAfterDelete(doc) {
  await syncMaterialCommentCount(doc?.material);
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
