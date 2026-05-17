import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Material from "../models/Material.js";
import { connectDB } from "../config/db.js";
import { getMimeType } from "../utils/fileHelpers.js";
import { uploadBufferToGridFs } from "../utils/gridFs.js";

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.join(__dirname, "..");
const legacyUploadDirs = [
  path.join(serverRoot, "uploads"),
  path.join(serverRoot, "Server", "uploads"),
];

const resolveLegacyFilePath = (fileUrl = "") => {
  const filename = path.basename(fileUrl);

  for (const directory of legacyUploadDirs) {
    const candidate = path.join(directory, filename);

    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
};

const run = async () => {
  await connectDB();

  const materials = await Material.find({
    fileUrl: { $regex: "^/uploads/" },
    $or: [{ fileId: { $exists: false } }, { fileId: null }],
  }).select("_id title fileUrl originalFilename mimeType");

  if (!materials.length) {
    console.log("No legacy uploads found to migrate.");
    await mongoose.disconnect();
    return;
  }

  for (const material of materials) {
    const filePath = resolveLegacyFilePath(material.fileUrl);

    if (!filePath) {
      console.warn(`Skipping ${material._id}: missing file for ${material.fileUrl}`);
      continue;
    }

    const buffer = fs.readFileSync(filePath);
    const originalFilename = material.originalFilename || path.basename(filePath);
    const mimeType = material.mimeType || getMimeType(originalFilename);
    const fileId = await uploadBufferToGridFs({
      buffer,
      filename: originalFilename,
      contentType: mimeType,
      metadata: {
        materialId: String(material._id),
        legacyFileUrl: material.fileUrl,
      },
    });

    await Material.updateOne(
      { _id: material._id },
      {
        $set: {
          fileId,
          originalFilename,
          mimeType,
          fileSize: buffer.length,
        },
        $unset: {
          fileUrl: "",
        },
      },
    );

    console.log(`Migrated ${material._id} from ${material.fileUrl}`);
  }

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Upload migration failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
