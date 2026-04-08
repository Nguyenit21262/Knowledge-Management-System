import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import KnowledgeBaseCard from "../../components/admin/KnowledgeBaseCard";
import { knowledgeBaseSubjects, mockDocuments } from "../../lib/mockDocuments";

const AdminKnowledgeBase = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSubject = searchParams.get("subject");
  const [searchValue, setSearchValue] = useState("");
  const [activeSubject, setActiveSubject] = useState(
    knowledgeBaseSubjects.includes(initialSubject) ? initialSubject : "All"
  );

  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredDocuments = useMemo(
    () =>
      mockDocuments.filter((document) => {
        const matchesSubject =
          activeSubject === "All" || document.subject === activeSubject;
        const searchableText =
          `${document.title} ${document.subject} ${document.author} ${document.category}`.toLowerCase();
        const matchesSearch = searchableText.includes(normalizedSearch);

        return matchesSubject && matchesSearch;
      }),
    [activeSubject, normalizedSearch]
  );

  return (
    <main className="px-8 py-10">
      <h1 className="text-[3rem] font-medium tracking-tight text-slate-950">
        Knowledge Base
      </h1>
      <p className="mt-3 text-[1.15rem] font-normal text-slate-500">
        Browse and search through all learning materials.
      </p>

      <div className="mt-10 flex items-center gap-4 rounded-md bg-[#faf6eb] px-6 py-5 text-slate-500">
        <Search className="h-6 w-6" strokeWidth={1.7} />
        <input
          type="text"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search articles, topics, authors..."
          className="w-full bg-transparent text-[1.1rem] font-normal outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
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
              className={`rounded-md px-6 py-3 text-[1.05rem] font-normal transition-colors ${
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

      <section className="mt-10 grid grid-cols-2 gap-6">
        {filteredDocuments.map((document) => (
          <KnowledgeBaseCard key={document.id} document={document} />
        ))}
      </section>

      {filteredDocuments.length === 0 && (
        <section className="mt-10 rounded-md border border-slate-200 bg-white px-8 py-12 text-center shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <p className="text-[1.05rem] font-normal text-slate-500">
            No materials match the current search or subject filter.
          </p>
        </section>
      )}
    </main>
  );
};

export default AdminKnowledgeBase;
