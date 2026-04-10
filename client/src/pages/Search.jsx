import React, { useState } from "react";
import { BookOpen, CalendarDays, Eye, Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { knowledgeBaseSubjects, mockDocuments } from "../lib/mockDocuments";

const Search = () => {
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredDocuments = mockDocuments.filter((document) => {
    const matchesSubject =
      activeSubject === "All" || document.subject === activeSubject;
    const searchableText =
      `${document.title} ${document.subject} ${document.author} ${document.category}`.toLowerCase();
    const matchesQuery = searchableText.includes(normalizedQuery);

    return matchesSubject && matchesQuery;
  });

  return (
    <main className="min-h-[calc(100vh-97px)] bg-[#f6f9ff] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-[2.3rem]">
            Search
          </h1>
          <p className="mt-2 text-[1rem] font-normal text-slate-500 sm:text-[1.08rem]">
            Find articles, materials, topics, or authors
          </p>
        </div>

        <div className="mb-6 flex max-w-[640px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-500 sm:px-5">
          <SearchIcon className="h-5 w-5" strokeWidth={1.8} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent text-[1rem] font-normal outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {knowledgeBaseSubjects.map((subject) => {
            const isActive = activeSubject === subject;

            return (
              <button
                key={subject}
                type="button"
                onClick={() => setActiveSubject(subject)}
                className={`rounded-full px-4 py-2 text-[0.95rem] font-normal sm:px-5 sm:text-[0.98rem] ${
                  isActive
                    ? "bg-[#253b6e] text-white"
                    : "bg-[#fbf1dd] text-slate-900"
                }`}
              >
                {subject}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {filteredDocuments.map((document) => (
            <Link
              key={document.id}
              to={`/documents/${document.id}`}
              className="rounded-[24px] border border-slate-200 bg-white px-5 py-5 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:px-6 sm:py-6"
            >
              <span className="inline-flex rounded-full bg-[#fbf1dd] px-3 py-1 text-[0.9rem] font-normal text-slate-900">
                {document.subject}
              </span>

              <h2 className="content-clamp-3 mt-5 text-[1.65rem] leading-tight font-medium tracking-tight text-slate-950 sm:text-[1.75rem]">
                {document.title}
              </h2>

              <p className="content-clamp-4 mt-4 text-[1rem] leading-8 font-normal text-slate-500 sm:text-[1.05rem]">
                {document.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-[0.95rem] font-normal text-slate-500 sm:gap-5 sm:text-[0.98rem]">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" strokeWidth={1.7} />
                  <span>{document.author}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" strokeWidth={1.7} />
                  <span>{document.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" strokeWidth={1.7} />
                  <span>{document.views}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <section className="rounded-[24px] border border-slate-200 bg-white px-5 py-10 text-center shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:px-8 sm:py-12">
            <p className="text-[1rem] font-normal text-slate-500 sm:text-[1.05rem]">
              No results match your search yet.
            </p>
          </section>
        )}
      </div>
    </main>
  );
};

export default Search;
