import mongoose from "mongoose";

const GRIDFS_BUCKET_NAME = "materialUploads";

const toObjectId = (value) =>
  value instanceof mongoose.Types.ObjectId
    ? value
    : new mongoose.Types.ObjectId(value);

export const getGridFsBucket = () => {
  if (!mongoose.connection?.db) {
    throw new Error("MongoDB connection is not ready.");
  }

  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: GRIDFS_BUCKET_NAME,
  });
};

export const uploadBufferToGridFs = ({
  buffer,
  filename,
  contentType,
  metadata,
}) =>
  new Promise((resolve, reject) => {
    const bucket = getGridFsBucket();
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata,
    });

    uploadStream.on("error", reject);
    uploadStream.on("finish", () => resolve(uploadStream.id));
    uploadStream.end(buffer);
  });

export const openGridFsDownloadStream = (fileId) => {
  const bucket = getGridFsBucket();
  return bucket.openDownloadStream(toObjectId(fileId));
};

export const deleteGridFsFile = async (fileId) => {
  const bucket = getGridFsBucket();
  await bucket.delete(toObjectId(fileId));
};
