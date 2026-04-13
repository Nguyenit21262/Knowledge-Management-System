import React from "react";
import { MessageSquare, Reply, Send, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useCommentTree from "../hooks/userCommentTree.js";
import { useAppContext } from "../context/useAppContext.js";
import { formatDate } from "../utils/formatters.js";
import {
  createComment,
  deleteComment,
  getCommentsByMaterial,
} from "../api/comments.js";

const roleClasses = {
  student: "bg-[#fbf1dd] text-slate-700",
  teacher: "bg-slate-100 text-slate-700",
  admin: "bg-blue-50 text-blue-700",
};

const getUserInitial = (name) =>
  String(name || "?")
    .trim()
    .charAt(0)
    .toUpperCase() || "?";

const createTempComment = ({ content, parentId, materialId, user }) => {
  const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    _id: tempId,
    id: tempId,
    materialId,
    parentId: parentId || null,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: user?.id || user?._id || "",
      name: user?.name || "You",
      role: user?.role || "student",
    },
    children: [],
    isPending: true,
  };
};

const CommentItem = ({
  comment,
  currentUserId,
  isAuthenticated,
  replyingToId,
  setReplyingToId,
  replyDrafts,
  setReplyDrafts,
  isSubmitting,
  activeSubmitParentId,
  onReplySubmit,
  onDelete,
  depth = 0,
}) => {
  const commentId = comment._id || comment.id;
  const replyDraft = replyDrafts[commentId] || "";
  const isOwner = currentUserId && comment.author.id === currentUserId;
  const isReplying = replyingToId === commentId;
  const isReplySubmitting = isSubmitting && activeSubmitParentId === commentId;
  const handleReplyKeyDown = (event) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (!isReplySubmitting && replyDraft.trim()) {
      onReplySubmit(commentId, replyDraft);
    }
  };

  return (
    <article
      className={`${depth > 0 ? "ml-6 border-l border-slate-200 pl-6" : ""} ${
        comment.isPending ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[var(--theme-blue)] text-[1.1rem] font-semibold text-white shadow-sm">
          {getUserInitial(comment.author.name)}
        </div>

        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h3 className="text-[1.05rem] font-normal text-slate-950">
              {comment.author.name}
            </h3>
            <span
              className={`rounded-lg px-3 py-1 text-[0.9rem] font-normal capitalize ${
                roleClasses[comment.author.role] ||
                "bg-slate-100 text-slate-700"
              }`}
            >
              {comment.author.role}
            </span>
            <span className="text-[0.95rem] text-slate-500">
              {formatDate(comment.createdAt)}
            </span>
            {comment.isPending && (
              <span className="text-[0.9rem] text-slate-400">Sending...</span>
            )}
          </div>

          <p className="text-[1.03rem] leading-8 text-slate-700">
            {comment.content}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {isAuthenticated && (
              <button
                type="button"
                onClick={() =>
                  setReplyingToId((currentId) =>
                    currentId === commentId ? null : commentId,
                  )
                }
                className="inline-flex items-center gap-2 text-[0.95rem] text-[var(--theme-blue)] transition hover:opacity-80"
              >
                <Reply className="h-4 w-4" strokeWidth={1.8} />
                Reply
              </button>
            )}

            {isOwner && (
              <button
                type="button"
                onClick={() => onDelete(commentId)}
                className="inline-flex items-center gap-2 text-[0.95rem] text-red-600 transition hover:opacity-80"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                Delete
              </button>
            )}
          </div>

          {isReplying && isAuthenticated && (
            <div className="mt-4 max-w-2xl">
              <textarea
                rows="2"
                value={replyDraft}
                onKeyDown={handleReplyKeyDown}
                onChange={(event) =>
                  setReplyDrafts((prevDrafts) => ({
                    ...prevDrafts,
                    [commentId]: event.target.value,
                  }))
                }
                placeholder={`Reply to ${comment.author.name}...`}
                className="min-h-[64px] w-full resize-none border-0 border-b border-slate-300 bg-transparent px-0 py-2 text-[0.98rem] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[var(--theme-blue)]"
              />

              <div className="mt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReplyingToId(null)}
                  className="rounded-full px-4 py-2 text-[0.92rem] font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isReplySubmitting || !replyDraft.trim()}
                  onClick={() => onReplySubmit(commentId, replyDraft)}
                  className="rounded-full bg-[var(--theme-blue)] px-5 py-2 text-[0.92rem] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isReplySubmitting ? "Replying..." : "Reply"}
                </button>
              </div>
            </div>
          )}

          {(comment.children || []).length > 0 && (
            <div className="mt-6 space-y-6">
              {comment.children.map((childComment) => (
                <CommentItem
                  key={childComment._id || childComment.id}
                  comment={childComment}
                  currentUserId={currentUserId}
                  isAuthenticated={isAuthenticated}
                  replyingToId={replyingToId}
                  setReplyingToId={setReplyingToId}
                  replyDrafts={replyDrafts}
                  setReplyDrafts={setReplyDrafts}
                  isSubmitting={isSubmitting}
                  activeSubmitParentId={activeSubmitParentId}
                  onReplySubmit={onReplySubmit}
                  onDelete={onDelete}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

const DocumentComments = ({ document }) => {
  const { user, isAuthenticated } = useAppContext();
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingToId, setReplyingToId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSubmitParentId, setActiveSubmitParentId] = useState(null);
  const latestLoadIdRef = useRef(0);
  const { handleAdd, handleDelete, total } = useCommentTree(setComments);

  const loadComments = useCallback(async ({ silent = false } = {}) => {
    if (!document?.id) {
      setComments([]);
      setIsLoading(false);
      return;
    }

    const loadId = latestLoadIdRef.current + 1;
    latestLoadIdRef.current = loadId;

    if (!silent) {
      setIsLoading(true);
    }

    try {
      const nextComments = await getCommentsByMaterial(document.id);

      if (latestLoadIdRef.current === loadId) {
        setComments(nextComments);
      }
    } catch (error) {
      if (!silent) {
        toast.error(error.message || "Failed to load comments.");
      }
    } finally {
      if (!silent && latestLoadIdRef.current === loadId) {
        setIsLoading(false);
      }
    }
  }, [document?.id]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const totalComments = useMemo(() => total(comments), [comments, total]);
  const currentUserInitial = getUserInitial(user?.name);

  const handleCommentKeyDown = (event) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (isAuthenticated && !isSubmitting && draft.trim()) {
      handlePostComment();
    }
  };

  const handlePostComment = async () => {
    if (!draft.trim()) {
      return;
    }

    const content = draft.trim();
    const optimisticComment = createTempComment({
      content,
      parentId: null,
      materialId: document.id,
      user,
    });

    try {
      setIsSubmitting(true);
      setActiveSubmitParentId(null);
      handleAdd(null, optimisticComment);
      setDraft("");
      await createComment(document.id, { content });
      await loadComments({ silent: true });
    } catch (error) {
      handleDelete(optimisticComment._id);
      setDraft(content);
      toast.error(error.message || "Failed to post comment.");
    } finally {
      setIsSubmitting(false);
      setActiveSubmitParentId(null);
    }
  };

  const handleReplySubmit = async (parentId, content) => {
    if (!content.trim()) {
      return;
    }

    const trimmedContent = content.trim();
    const optimisticReply = createTempComment({
      content: trimmedContent,
      parentId,
      materialId: document.id,
      user,
    });

    try {
      setIsSubmitting(true);
      setActiveSubmitParentId(parentId);
      handleAdd(parentId, optimisticReply);
      await createComment(document.id, {
        content: trimmedContent,
        parentId,
      });
      setReplyDrafts((prevDrafts) => ({
        ...prevDrafts,
        [parentId]: "",
      }));
      setReplyingToId(null);
      await loadComments({ silent: true });
    } catch (error) {
      handleDelete(optimisticReply._id);
      toast.error(error.message || "Failed to post reply.");
    } finally {
      setIsSubmitting(false);
      setActiveSubmitParentId(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      handleDelete(commentId);
      await deleteComment(commentId);
      await loadComments({ silent: true });
    } catch (error) {
      await loadComments({ silent: true });
      toast.error(error.message || "Failed to delete comment.");
    }
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white px-8 py-10 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <div className="mb-10 flex items-center gap-3 text-slate-950">
        <MessageSquare className="h-7 w-7 text-[#f59e0b]" strokeWidth={1.8} />
        <h2 className="text-[2rem] font-medium tracking-tight">
          Comments ({totalComments})
        </h2>
      </div>

      <div className="mb-12">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--theme-blue)] text-[1.45rem] font-semibold text-white shadow-sm">
            {currentUserInitial}
          </div>

          <textarea
            rows="4"
            value={draft}
            onKeyDown={handleCommentKeyDown}
            onChange={(event) => setDraft(event.target.value)}
            disabled={!isAuthenticated || isSubmitting}
            placeholder="Add a comment or ask a question..."
            className="min-h-[145px] flex-1 resize-none rounded-3xl border border-slate-200 px-6 py-5 text-[1.1rem] text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handlePostComment}
            disabled={!isAuthenticated || isSubmitting || !draft.trim()}
            className="inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-4  font-normal text-white"
          >
            <Send className="h-5 w-5" strokeWidth={1.8} />
            {isSubmitting && !activeSubmitParentId
              ? "Posting..."
              : "Post Comment"}
          </button>
        </div>

        {!isAuthenticated && (
          <p className="mt-4 text-right text-[0.95rem] text-slate-500">
            Please sign in to join the discussion.
          </p>
        )}
      </div>

      <div className="space-y-10">
        {isLoading ? (
          <div className="text-[1rem] text-slate-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-[1rem] text-slate-500">
            No comments yet. Start the discussion.
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id || comment.id}
              comment={comment}
              currentUserId={user?.id || user?._id || ""}
              isAuthenticated={isAuthenticated}
              replyingToId={replyingToId}
              setReplyingToId={setReplyingToId}
              replyDrafts={replyDrafts}
              setReplyDrafts={setReplyDrafts}
              isSubmitting={isSubmitting}
              activeSubmitParentId={activeSubmitParentId}
              onReplySubmit={handleReplySubmit}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default DocumentComments;
