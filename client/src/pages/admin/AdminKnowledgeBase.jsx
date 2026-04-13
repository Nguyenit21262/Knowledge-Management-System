import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import KnowledgeBaseCard from "../../components/admin/KnowledgeBaseCard";
import useMaterials from "../../hooks/useMaterials.js";

const AdminKnowledgeBase = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSubject = searchParams.get("subject");
  const [searchValue, setSearchValue] = useState("");

  const { materials, isLoading } = useMaterials();

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

  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <h1 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl lg:text-[3rem]">
        Knowledge Base
      </h1>
      <p className="mt-3 max-w-2xl text-base font-normal text-slate-500 sm:text-[1.08rem] lg:text-[1.15rem]">
        Browse and search through all learning materials.
      </p>

      <div className="mt-8 flex items-center gap-3 rounded-md bg-[#faf6eb] px-4 py-4 text-slate-500 sm:mt-10 sm:gap-4 sm:px-6 sm:py-5">
        <Search className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={1.7} />
        <input
          type="text"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search articles, topics, authors..."
          className="w-full bg-transparent text-[1rem] font-normal outline-none placeholder:text-slate-400 sm:text-[1.1rem]"
        />
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
                  ? "bg-[#253b6e] text-white"
                  : "bg-[#faf6eb] text-slate-900"
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
          <section className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-6 xl:grid-cols-2">
            {filteredDocuments.map((document) => (
              <KnowledgeBaseCard key={document.id} document={document} />
            ))}
          </section>

          {filteredDocuments.length === 0 && (
            <section className="mt-8 rounded-md border border-slate-200 bg-white px-5 py-10 text-center shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:mt-10 sm:px-8 sm:py-12">
              <p className="text-[1rem] font-normal text-slate-500 sm:text-[1.05rem]">
                No materials match the current search or subject filter.
              </p>
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default AdminKnowledgeBase;
