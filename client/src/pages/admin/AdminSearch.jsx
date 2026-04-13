import React, { useEffect, useMemo, useRef } from "react";
import { BookOpen, CalendarDays, Eye, Search as SearchIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteMaterial } from "../../api/materials.js";
import useMaterialSuggestions from "../../hooks/useMaterialSuggestions.js";
import useMaterials from "../../hooks/useMaterials.js";
import { formatDate, formatRole } from "../../utils/formatters.js";

const AdminSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const requestedSubject = searchParams.get("subject") || "All";
  const [deletingId, setDeletingId] = React.useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = React.useState(false);
  const searchRef = useRef(null);
  const suggestions = useMaterialSuggestions(query);
  const { materials, isLoading, error, refetch } = useMaterials({ searchQuery: query });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load search results.");
    }
  }, [error]);

  useEffect(() => {
    setIsSuggestionsOpen(suggestions.length > 0);
  }, [suggestions]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        setIsSuggestionsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const subjects = useMemo(() => {
    const unique = Array.from(new Set(materials.map((material) => material.subject)))
      .filter(Boolean)
      .sort();

    return ["All", ...unique];
  }, [materials]);

  const activeSubject = subjects.includes(requestedSubject)
    ? requestedSubject
    : "All";

  const filteredMaterials = useMemo(
    () =>
      materials.filter((material) =>
        activeSubject === "All" ? true : material.subject === activeSubject,
      ),
    [activeSubject, materials],
  );

  const updateSearchParams = ({
    nextQuery = query,
    nextSubject = activeSubject,
  }) => {
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

  const handleDelete = async (documentId) => {
    if (!window.confirm("Delete this material from the knowledge base?")) {
      return;
    }

    setDeletingId(documentId);

    try {
      await deleteMaterial(documentId);
      toast.success("Material deleted successfully.");
      await refetch();
    } catch (deleteError) {
      toast.error(deleteError.message || "Failed to delete material.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <h1 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl lg:text-[3rem]">
        Search
      </h1>
      <p className="mt-3 max-w-2xl text-base font-normal text-slate-500 sm:text-[1.08rem] lg:text-[1.15rem]">
        Search across all uploaded materials and narrow results by subject.
      </p>

      <div ref={searchRef} className="relative mt-8 sm:mt-10">
        <div className="flex items-center gap-3 rounded-md bg-[#ffffff] px-4 py-4 text-slate-500 sm:gap-4 sm:px-6 sm:py-5">
          <SearchIcon className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={1.7} />
          <input
            type="text"
            value={query}
            onChange={(event) =>
              updateSearchParams({ nextQuery: event.target.value })
            }
            onFocus={() => {
              if (suggestions.length > 0) {
                setIsSuggestionsOpen(true);
              }
            }}
            placeholder="Search by title, subject, category, author..."
            className="w-full bg-transparent text-[1rem] font-normal outline-none placeholder:text-slate-400 sm:text-[1.1rem]"
          />
        </div>

        {isSuggestionsOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  updateSearchParams({ nextQuery: suggestion });
                  setIsSuggestionsOpen(false);
                }}
                className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left text-[0.96rem] text-slate-700 transition hover:bg-slate-50 last:border-b-0"
              >
                <SearchIcon
                  className="h-4 w-4 shrink-0 text-slate-400"
                  strokeWidth={1.8}
                />
                <span className="truncate">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-[0.98rem] text-slate-500">
        <p>
          {isLoading
            ? "Searching materials..."
            : `${filteredMaterials.length} result${filteredMaterials.length === 1 ? "" : "s"} found`}
        </p>
        <p>{query ? `Keyword: "${query}"` : "Showing all materials"}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3">
        {subjects.map((subject) => {
          const isActive = subject === activeSubject;

          return (
            <button
              key={subject}
              type="button"
              onClick={() => updateSearchParams({ nextSubject: subject })}
              className={`rounded-md px-4 py-2.5 text-[0.98rem] font-normal transition-colors sm:px-6 sm:py-3 sm:text-[1.05rem] ${
                isActive
                  ? "bg-[#3b82f6] text-white"
                  : "bg-[#ffffff] text-slate-900"
              }`}
            >
              {subject}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="mt-10 py-10 text-center text-slate-500">
          Loading search results...
        </div>
      ) : filteredMaterials.length === 0 ? (
        <section className="mt-8 rounded-md border border-slate-200 bg-white px-5 py-10 text-center shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:mt-10 sm:px-8 sm:py-12">
          <p className="text-[1rem] font-normal text-slate-500 sm:text-[1.05rem]">
            No materials match the current keyword or subject filter.
          </p>
        </section>
      ) : (
        <section className="mt-8 overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:mt-10">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Title
                  </th>
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Subject
                  </th>
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Category
                  </th>
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Author
                  </th>
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Type
                  </th>
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Views
                  </th>
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Published
                  </th>
                  <th className="px-5 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredMaterials.map((document) => (
                  <tr
                    key={document.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-5 py-5 align-top sm:px-6 lg:px-8">
                      <div className="min-w-[260px]">
                        <Link
                          to={`/documents/${document.id}`}
                          className="text-[1rem] font-medium text-slate-950 transition hover:text-[var(--theme-blue)]"
                        >
                          {document.title}
                        </Link>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-[0.88rem] text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
                            {document.downloads || 0} downloads
                          </span>
                          <span>{document.commentsCount || 0} comments</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 sm:px-6 lg:px-8">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[0.88rem] text-slate-700">
                        {document.subject}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-[0.95rem] text-slate-600 sm:px-6 lg:px-8">
                      {document.category}
                    </td>
                    <td className="px-5 py-5 sm:px-6 lg:px-8">
                      <div className="min-w-[160px]">
                        <p className="text-[0.95rem] text-slate-700">
                          {document.author}
                        </p>
                        <p className="text-[0.88rem] text-slate-400">
                          {formatRole(document.authorRole)}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-[0.95rem] text-slate-600 sm:px-6 lg:px-8">
                      {document.type}
                    </td>
                    <td className="px-5 py-5 text-[0.95rem] text-slate-600 sm:px-6 lg:px-8">
                      <span className="inline-flex items-center gap-2">
                        <Eye className="h-4 w-4" strokeWidth={1.7} />
                        {(document.views || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-[0.95rem] text-slate-500 sm:px-6 lg:px-8">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" strokeWidth={1.7} />
                        {formatDate(document.date)}
                      </span>
                    </td>
                    <td className="px-5 py-5 sm:px-6 lg:px-8">
                      <button
                        type="button"
                        onClick={() => handleDelete(document.id)}
                        disabled={deletingId === document.id}
                        className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[0.9rem] font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === document.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
};

export default AdminSearch;
