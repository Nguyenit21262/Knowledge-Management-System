import { useCallback, useEffect, useState } from "react";
import {
  getAllMaterials,
  getUserMaterials,
  searchMaterials as searchMaterialsApi,
} from "../api/materials.js";

const useMaterials = ({
  userId = null,
  searchQuery = "",
  letter = null,
  sortBy = null,
  sortOrder = null,
  subject = null,
  skip = false,
} = {}) => {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const normalizedSearchQuery =
        typeof searchQuery === "string" ? searchQuery.trim() : "";

      const hasFilters = letter || sortBy || sortOrder || subject;

      let data;
      if (userId) {
        data = await getUserMaterials(userId);
      } else if (normalizedSearchQuery || hasFilters) {
        data = await searchMaterialsApi(normalizedSearchQuery, {
          letter: letter || undefined,
          sortBy: sortBy || undefined,
          sortOrder: sortOrder || undefined,
          subject: subject || undefined,
        });
      } else {
        data = await getAllMaterials();
      }

      setMaterials(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, userId, letter, sortBy, sortOrder, subject]);

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
