import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteMaterial } from "../../api/materials.js";
import useMaterialSuggestions from "../../hooks/useMaterialSuggestions.js";
import useMaterials from "../../hooks/useMaterials.js";
import { formatDate, formatRole } from "../../utils/formatters.js";

const AdminKnowledgeBase = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSubject = searchParams.get("subject");
  const [searchValue, setSearchValue] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const searchRef = useRef(null);
  const suggestions = useMaterialSuggestions(searchValue);

  const { materials, isLoading, refetch } = useMaterials();

  // Build dynamic subject list from real data
  const knowledgeBaseSubjects = useMemo(() => {
    const unique = Array.from(new Set(materials.map((m) => m.subject)))
      .filter(Boolean)
      .sort();
    return ["All", ...unique];
  }, [materials]);

  const [activeSubject, setActiveSubject] = useState(
    initialSubject && initialSubject !== "All" ? initialSubject : "All"
  );

  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredDocuments = useMemo(
    () =>
      materials.filter((document) => {
        const matchesSubject =
          activeSubject === "All" || document.subject === activeSubject;
        const searchableText =
          `${document.title} ${document.subject} ${document.author} ${document.category}`.toLowerCase();
        const matchesSearch = searchableText.includes(normalizedSearch);

        return matchesSubject && matchesSearch;
      }),
    [materials, activeSubject, normalizedSearch]
  );

  const handleDelete = async (documentId) => {
    if (!window.confirm("Delete this material from the knowledge base?")) {
      return;
    }

    setDeletingId(documentId);

    try {
      await deleteMaterial(documentId);
      toast.success("Material deleted successfully.");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Failed to delete material.");
    } finally {
      setDeletingId("");
    }
  };

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

  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <h1 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl lg:text-[3rem]">
        Knowledge Base
      </h1>
      <p className="mt-3 max-w-2xl text-base font-normal text-slate-500 sm:text-[1.08rem] lg:text-[1.15rem]">
        Browse and search through all learning materials.
      </p>

      <div ref={searchRef} className="relative mt-8 sm:mt-10">
        <div className="flex items-center gap-3 rounded-md bg-[#ffffff] px-4 py-4 text-slate-500 sm:gap-4 sm:px-6 sm:py-5">
          <Search className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={1.7} />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) {
                setIsSuggestionsOpen(true);
              }
            }}
            placeholder="Search articles, topics, authors..."
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
                  setSearchValue(suggestion);
                  setIsSuggestionsOpen(false);
                }}
                className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left text-[0.96rem] text-slate-700 transition hover:bg-slate-50 last:border-b-0"
              >
                <Search className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.8} />
                <span className="truncate">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3">
        {knowledgeBaseSubjects.map((subject) => {
          const isActive = subject === activeSubject;

          return (
            <button
              key={subject}
              type="button"
              onClick={() => {
                setActiveSubject(subject);
                setSearchParams(
                  subject === "All" ? {} : { subject },
                  { replace: true }
                );
              }}
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
        <div className="mt-10 py-10 text-center text-slate-500">Loading knowledge base...</div>
      ) : (
        <>
          {filteredDocuments.length === 0 ? (
            <section className="mt-8 rounded-md border border-slate-200 bg-white px-5 py-10 text-center shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:mt-10 sm:px-8 sm:py-12">
              <p className="text-[1rem] font-normal text-slate-500 sm:text-[1.05rem]">
                No materials match the current search or subject filter.
              </p>
            </section>
          ) : (
            <section className="mt-8 overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:mt-10">
              <div className="scrollbar-none overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
                      <th className="px-3 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-4 lg:px-5">
                        Title
                      </th>
                      <th className="px-3 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-4 lg:px-5">
                        Subject
                      </th>
                      <th className="px-3 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-4 lg:px-5">
                        Category
                      </th>
                      <th className="px-3 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-4 lg:px-5">
                        Author
                      </th>
                      <th className="px-3 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-4 lg:px-5">
                        Type
                      </th>
                      <th className="px-3 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-4 lg:px-5">
                        Views
                      </th>
                      <th className="px-3 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-4 lg:px-5">
                        Downloads
                      </th>
                      <th className="px-3 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-4 lg:px-5">
                        Comments
                      </th>
                      <th className="px-3 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-4 lg:px-5">
                        Published
                      </th>
                      <th className="px-3 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-4 lg:px-5">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDocuments.map((document) => (
                      <tr
                        key={document.id}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="px-3 py-4 align-top sm:px-4 lg:px-5">
                          <div className="min-w-[220px]">
                            <Link
                              to={`/documents/${document.id}`}
                              className="text-[1rem] font-medium text-slate-950 transition hover:text-[var(--theme-blue)]"
                            >
                              {document.title}
                            </Link>
                          </div>
                        </td>
                        <td className="px-3 py-4 sm:px-4 lg:px-5">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[0.88rem] text-slate-700">
                            {document.subject}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-[0.95rem] text-slate-600 sm:px-4 lg:px-5">
                          {document.category}
                        </td>
                        <td className="px-3 py-4 sm:px-4 lg:px-5">
                          <div className="min-w-[140px]">
                            <p className="text-[0.95rem] text-slate-700">
                              {document.author}
                            </p>
                            <p className="text-[0.88rem] text-slate-400">
                              {formatRole(document.authorRole)}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-[0.95rem] text-slate-600 sm:px-4 lg:px-5">
                          {document.type}
                        </td>
                        <td className="px-3 py-4 text-[0.95rem] text-slate-600 sm:px-4 lg:px-5">
                          {(document.views || 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-4 text-[0.95rem] text-slate-600 sm:px-4 lg:px-5">
                          {(document.downloads || 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-4 text-[0.95rem] text-slate-600 sm:px-4 lg:px-5">
                          {(document.commentsCount || 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-4 text-[0.95rem] text-slate-500 sm:px-4 lg:px-5">
                          {formatDate(document.date)}
                        </td>
                        <td className="px-3 py-4 sm:px-4 lg:px-5">
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
        </>
      )}
    </main>
  );
};

export default AdminKnowledgeBase;
