import Notification from "../models/Notification.js";

const toIdString = (value) => value?.toString?.() || String(value || "");

const isSameUser = (left, right) =>
  Boolean(left) && Boolean(right) && toIdString(left) === toIdString(right);

export const createCommentNotifications = async ({
  actorId,
  material,
  parentComment = null,
  commentId,
}) => {
  const notificationsByRecipient = new Map();
  const materialOwnerId = material?.uploadedBy;
  const parentAuthorId = parentComment?.author;

  if (materialOwnerId && !isSameUser(materialOwnerId, actorId)) {
    notificationsByRecipient.set(toIdString(materialOwnerId), {
      recipient: materialOwnerId,
      type: "material_comment",
    });
  }

  if (parentAuthorId && !isSameUser(parentAuthorId, actorId)) {
    notificationsByRecipient.set(toIdString(parentAuthorId), {
      recipient: parentAuthorId,
      type: "comment_reply",
    });
  }

  if (notificationsByRecipient.size === 0) {
    return [];
  }

  return Promise.all(
    Array.from(notificationsByRecipient.values()).map((notification) =>
      Notification.create({
        ...notification,
        actor: actorId,
        material: material._id,
        comment: commentId,
      }),
    ),
  );
};
