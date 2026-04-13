import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  BookOpen,
  CalendarDays,
  Eye,
  Search as SearchIcon,
  SlidersHorizontal,
  ArrowDownAZ,
  ArrowUpZA,
  X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import useMaterials from "../hooks/useMaterials.js";
import { getLetterCounts } from "../api/materials.js";
import { formatDate } from "../utils/formatters.js";
import toast from "react-hot-toast";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const requestedSubject = searchParams.get("subject") || "All";

  // --- Alphabet filter state ---
  const [showAlphabetFilter, setShowAlphabetFilter] = useState(false);
  const [activeLetter, setActiveLetter] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" = A→Z, "desc" = Z→A
  const filterPanelRef = useRef(null);
  const filterBtnRef = useRef(null);

  // --- Letter counts from API ---
  const [letterCounts, setLetterCounts] = useState({});

  // Determine if any filter is active to pass to API
  const isFilterActive = activeLetter !== null || sortDirection === "desc";

  // Use the hook with server-side filter params
  const { materials, isLoading, error } = useMaterials({
    searchQuery: query,
    letter: activeLetter,
    sortBy: isFilterActive ? "title" : undefined,
    sortOrder: isFilterActive ? sortDirection : undefined,
    subject: requestedSubject !== "All" ? requestedSubject : undefined,
  });

  // Fetch letter counts from API on mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts = await getLetterCounts();
        setLetterCounts(counts);
      } catch {
        // Silent fail — letter counts are non-critical
      }
    };
    fetchCounts();
  }, []);

  // Close the panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showAlphabetFilter &&
        filterPanelRef.current &&
        !filterPanelRef.current.contains(e.target) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(e.target)
      ) {
        setShowAlphabetFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAlphabetFilter]);

  useEffect(() => {
    if (error) toast.error("Failed to load documents for search.");
  }, [error]);

  // Build subject filter list from current results
  // Note: Since server now filters, we show subjects from all materials
  // We still show subject buttons from the current result set
  const filterSubjects = (() => {
    const unique = Array.from(new Set(materials.map((m) => m.subject)))
      .filter(Boolean)
      .sort();
    return ["All", ...unique];
  })();

  const activeSubject = filterSubjects.includes(requestedSubject)
    ? requestedSubject
    : "All";

  const updateSearchParams = ({ nextQuery = query, nextSubject = activeSubject }) => {
    const nextParams = new URLSearchParams(searchParams);

    if (nextQuery.trim()) {
      nextParams.set("q", nextQuery);
    } else {
      nextParams.delete("q");
    }

    if (nextSubject && nextSubject !== "All") {
      nextParams.set("subject", nextSubject);
    } else {
      nextParams.delete("subject");
    }

    setSearchParams(nextParams, { replace: true });
  };

  const handleLetterClick = useCallback((letter) => {
    setActiveLetter((prev) => (prev === letter ? null : letter));
  }, []);

  const clearFilter = useCallback(() => {
    setActiveLetter(null);
    setSortDirection("asc");
  }, []);

  return (
    <main className="min-h-[calc(100vh-97px)] bg-[#f6f9ff] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-[2.3rem]">
            Search
          </h1>
          <p className="mt-2 text-[1rem] font-normal text-slate-500 sm:text-[1.08rem]">
            Find documents by subject, title, category, or author
          </p>
        </div>

        {/* Search bar with filter icon */}
        <div className="mb-6 flex max-w-[720px] items-center gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-500 sm:px-5">
            <SearchIcon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
            <input
              type="text"
              value={query}
              onChange={(event) =>
                updateSearchParams({ nextQuery: event.target.value })
              }
              placeholder="Search by subject, title, category, or author..."
              className="w-full bg-transparent text-[1rem] font-normal outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Filter toggle button */}
          <div className="relative">
            <button
              ref={filterBtnRef}
              type="button"
              id="alphabet-filter-toggle"
              onClick={() => setShowAlphabetFilter((prev) => !prev)}
              title="Alphabet Filter (A-Z)"
              className={`group relative flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-2xl border transition-all duration-200 ${
                isFilterActive
                  ? "border-[#3b82f6] bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/20"
                  : showAlphabetFilter
                  ? "border-slate-300 bg-slate-100 text-slate-700"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" strokeWidth={1.8} />
              {isFilterActive && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-400 text-[0.6rem] font-bold text-slate-900">
                  ✓
                </span>
              )}
            </button>

            {/* Alphabet filter dropdown panel */}
            {showAlphabetFilter && (
              <div
                ref={filterPanelRef}
                className="absolute right-0 top-[calc(100%+8px)] z-50 w-[340px] sm:w-[380px] animate-in fade-in slide-in-from-top-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_48px_rgba(15,23,42,0.12)]"
                style={{
                  animation: "filterPanelIn 0.2s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[0.95rem] font-semibold tracking-tight text-slate-900">
                    Filter by Letter
                  </h3>
                  <div className="flex items-center gap-2">
                    {/* Sort direction toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
                      }
                      title={sortDirection === "asc" ? "Sorting A → Z" : "Sorting Z → A"}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.8rem] font-medium transition-colors ${
                        sortDirection === "desc"
                          ? "bg-[#3b82f6] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {sortDirection === "asc" ? (
                        <ArrowDownAZ className="h-3.5 w-3.5" strokeWidth={2} />
                      ) : (
                        <ArrowUpZA className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      {sortDirection === "asc" ? "A → Z" : "Z → A"}
                    </button>

                    {/* Clear button */}
                    {isFilterActive && (
                      <button
                        type="button"
                        onClick={clearFilter}
                        className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-[0.8rem] font-medium text-red-600 transition-colors hover:bg-red-100"
                      >
                        <X className="h-3 w-3" strokeWidth={2.5} />
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Active letter indicator */}
                {activeLetter && (
                  <div className="mb-3 flex items-center gap-2 rounded-xl bg-[#3b82f6]/5 px-3 py-2">
                    <span className="text-[0.85rem] font-medium text-[#3b82f6]">
                      Showing titles starting with "{activeLetter}"
                    </span>
                    <span className="ml-auto rounded-full bg-[#3b82f6] px-2 py-0.5 text-[0.72rem] font-semibold text-white">
                      {letterCounts[activeLetter] || 0} results
                    </span>
                  </div>
                )}

                {/* Letter grid */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {ALPHABET.map((letter) => {
                    const count = letterCounts[letter] || 0;
                    const isActive = activeLetter === letter;
                    const isEmpty = count === 0;

                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => handleLetterClick(letter)}
                        disabled={isEmpty}
                        title={`${letter} — ${count} document${count !== 1 ? "s" : ""}`}
                        className={`relative flex h-10 w-full items-center justify-center rounded-xl text-[0.88rem] font-semibold transition-all duration-150 ${
                          isActive
                            ? "bg-[#3b82f6] text-white shadow-md shadow-[#3b82f6]/25 scale-105"
                            : isEmpty
                            ? "cursor-not-allowed bg-slate-50 text-slate-300"
                            : "bg-slate-100 text-slate-700 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] active:scale-95"
                        }`}
                      >
                        {letter}
                        {count > 0 && !isActive && (
                          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-400 text-[0.5rem] font-bold text-slate-900">
                            {count > 9 ? "9+" : count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Show all button */}
                <button
                  type="button"
                  onClick={() => setActiveLetter(null)}
                  className={`mt-3 w-full rounded-xl py-2.5 text-[0.85rem] font-medium transition-colors ${
                    activeLetter === null
                      ? "bg-[#3b82f6] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Show All Letters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active filter badge (shown below search bar when filter is active) */}
        {isFilterActive && (
          <div className="mb-5 flex items-center gap-2">
            {activeLetter && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3b82f6] px-3.5 py-1.5 text-[0.85rem] font-medium text-white">
                Letter: {activeLetter}
                <button
                  type="button"
                  onClick={() => setActiveLetter(null)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-white/20 transition-colors"
                >
                  <X className="h-3 w-3" strokeWidth={2.5} />
                </button>
              </span>
            )}
            {sortDirection === "desc" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-700 px-3.5 py-1.5 text-[0.85rem] font-medium text-white">
                <ArrowUpZA className="h-3.5 w-3.5" strokeWidth={2} />
                Z → A
              </span>
            )}
            <button
              type="button"
              onClick={clearFilter}
              className="text-[0.83rem] font-medium text-red-500 hover:text-red-600 transition-colors ml-1"
            >
              Clear all filters
            </button>
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-3">
          {filterSubjects.map((subject) => {
            const isActive = activeSubject === subject;

            return (
              <button
                key={subject}
                type="button"
                onClick={() => updateSearchParams({ nextSubject: subject })}
                className={`rounded-full px-4 py-2 text-[0.95rem] font-normal transition-colors sm:px-5 sm:text-[0.98rem] ${
                  isActive
                    ? "bg-[#3b82f6] text-white"
                    : "bg-[#e0e7ff] text-slate-900 hover:bg-[#c7d2fe]"
                }`}
              >
                {subject}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-[1.05rem] text-slate-500">
            Searching knowledge base...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {materials.map((document) => (
                <Link
                  key={document.id}
                  to={`/documents/${document.id}`}
                  className="rounded-[24px] border border-slate-200 bg-white px-5 py-5 shadow-[0_6px_20px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] sm:px-6 sm:py-6"
                >
                  <span className="inline-flex rounded-full bg-[#e0e7ff] px-3 py-1 text-[0.9rem] font-normal text-slate-900">
                    {document.subject}
                  </span>

                  <h2 className="content-clamp-3 mt-5 text-[1.65rem] leading-tight font-medium tracking-tight text-slate-950 sm:text-[1.75rem]">
                    {document.title}
                  </h2>

                  <p className="content-clamp-4 mt-4 text-[1rem] leading-8 font-normal text-slate-500 sm:text-[1.05rem]">
                    {document.description || "No description available."}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-4 text-[0.95rem] font-normal text-slate-500 sm:gap-5 sm:text-[0.98rem]">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" strokeWidth={1.7} />
                      <span>{document.author}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" strokeWidth={1.7} />
                      <span>{formatDate(document.date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" strokeWidth={1.7} />
                      <span>{document.views || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {materials.length === 0 && (
              <section className="rounded-[24px] border border-slate-200 bg-white px-5 py-10 text-center shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:px-8 sm:py-12 mt-4">
                <p className="text-[1rem] font-normal text-slate-500 sm:text-[1.05rem]">
                  No results match your search yet.
                </p>
              </section>
            )}
          </>
        )}
      </div>

      {/* Inline animation styles */}
      <style>{`
        @keyframes filterPanelIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
};

export default Search;
