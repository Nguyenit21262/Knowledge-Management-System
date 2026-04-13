import mongoose from "mongoose";

export const USER_ROLES = ["student", "teacher"];

export const normalizeUserRole = (role) => {
  if (role === "teacher" || role === "admin") {
    return "teacher";
  }

  return "student";
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "student",
      index: true,
      set: normalizeUserRole,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

UserSchema.index({ role: 1, createdAt: -1 });
UserSchema.index({ role: 1, isActive: 1, createdAt: -1 });

UserSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: normalizeUserRole(this.role),
    isActive: this.isActive,
    bookmarks: this.bookmarks || [],
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model("User", UserSchema);

export default User;
