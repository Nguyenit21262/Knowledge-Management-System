import { useCallback, useEffect, useState } from "react";
import { getAllMaterials, getUserMaterials } from "../api/materials.js";

/**
 * Generic hook for fetching materials with loading / error state.
 *
 * @param {Object}  options
 * @param {string}  [options.userId]  – When set, fetches only this user's uploads.
 * @param {boolean} [options.skip]    – Skip the initial fetch (useful when data isn't needed yet).
 * @returns {{ materials, isLoading, error, refetch, setMaterials }}
 */
const useMaterials = ({ userId = null, skip = false } = {}) => {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = userId
        ? await getUserMaterials(userId)
        : await getAllMaterials();
      setMaterials(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (skip) {
      setIsLoading(false);
      return;
    }

    fetchMaterials();
  }, [fetchMaterials, skip]);

  return { materials, isLoading, error, refetch: fetchMaterials, setMaterials };
};

export default useMaterials;
