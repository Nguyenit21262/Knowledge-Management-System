import { useEffect, useState } from "react";
import { getMaterialSuggestions } from "../api/materials.js";

const SUGGESTION_DEBOUNCE_MS = 220;

const useMaterialSuggestions = (query) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const trimmedQuery = String(query || "").trim();

    if (!trimmedQuery) {
      setSuggestions([]);
      return;
    }

    let isMounted = true;
    const timeoutId = window.setTimeout(async () => {
      try {
        const nextSuggestions = await getMaterialSuggestions(trimmedQuery);

        if (!isMounted) {
          return;
        }

        setSuggestions(nextSuggestions);
      } catch {
        if (!isMounted) {
          return;
        }

        setSuggestions([]);
      }
    }, SUGGESTION_DEBOUNCE_MS);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  return suggestions;
};

export default useMaterialSuggestions;
