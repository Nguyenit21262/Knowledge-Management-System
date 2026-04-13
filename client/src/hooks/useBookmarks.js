import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { toggleBookmark as toggleBookmarkApi } from "../api/users.js";
import { useAppContext } from "../context/useAppContext.js";

/**
 * Hook that encapsulates bookmark toggle logic.
 * Used by DocumentOverview and Bookmarks pages to avoid duplication.
 *
 * @returns {{ isBookmarked, isToggling, handleToggleBookmark, handleRemoveBookmark }}
 */
const useBookmarks = () => {
  const { user, refreshCurrentUser } = useAppContext();
  const [isToggling, setIsToggling] = useState(false);

  /**
   * Check whether a material is bookmarked by the current user.
   * @param {string} materialId
   * @returns {boolean}
   */
  const isBookmarked = useCallback(
    (materialId) => {
      return user?.bookmarks?.includes(materialId) || false;
    },
    [user?.bookmarks],
  );

  /**
   * Toggle bookmark state for a material (add or remove).
   * @param {string} materialId
   * @returns {Promise<boolean>} – true if bookmarked after toggle, false if removed.
   */
  const handleToggleBookmark = useCallback(
    async (materialId) => {
      if (!user) {
        toast.error("Please log in to save bookmarks.");
        return false;
      }

      try {
        setIsToggling(true);
        const wasSaved = isBookmarked(materialId);
        await toggleBookmarkApi(materialId);
        await refreshCurrentUser();
        toast.success(
          wasSaved ? "Removed from bookmarks" : "Added to bookmarks",
        );
        return !wasSaved;
      } catch {
        toast.error("Failed to save bookmark");
        return isBookmarked(materialId);
      } finally {
        setIsToggling(false);
      }
    },
    [user, isBookmarked, refreshCurrentUser],
  );

  /**
   * Convenience wrapper specifically for removing a bookmark.
   * @param {string} materialId
   */
  const handleRemoveBookmark = useCallback(
    async (materialId) => {
      try {
        setIsToggling(true);
        await toggleBookmarkApi(materialId);
        await refreshCurrentUser();
        toast.success("Removed from bookmarks");
      } catch {
        toast.error("Failed to remove bookmark");
      } finally {
        setIsToggling(false);
      }
    },
    [refreshCurrentUser],
  );

  return { isBookmarked, isToggling, handleToggleBookmark, handleRemoveBookmark };
};

export default useBookmarks;
