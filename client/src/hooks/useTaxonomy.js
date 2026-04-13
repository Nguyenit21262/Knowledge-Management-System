import { useEffect, useState } from "react";
import { httpClient } from "../api/httpClient.js";

/**
 * Hook for fetching subject and category options from the server.
 * Used by UploadNew and potentially admin pages.
 *
 * @returns {{ subjects, categories, isLoading }}
 */
const useTaxonomy = () => {
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTaxonomy = async () => {
      try {
        const [subRes, catRes] = await Promise.all([
          httpClient.get("/api/subjects"),
          httpClient.get("/api/categories"),
        ]);

        if (isMounted) {
          setSubjects(subRes.data?.map((s) => s.name) || []);
          setCategories(catRes.data?.map((c) => c.name) || []);
        }
      } catch (err) {
        console.error("Failed to load taxonomy options.", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTaxonomy();

    return () => {
      isMounted = false;
    };
  }, []);

  return { subjects, categories, isLoading };
};

export default useTaxonomy;
