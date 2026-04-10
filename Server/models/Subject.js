import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
});

const Subject = mongoose.model("Subject", SubjectSchema);

export default Subject;
