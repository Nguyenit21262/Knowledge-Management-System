import React from "react";
import { Bookmark, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { mockDocuments } from "../lib/mockDocuments";

const savedRows = [
  {
    documentId: "introduction-to-photosynthesis",
    savedAt: "Saved on Apr 7, 2026",
  },
  {
    documentId: "quadratic-equations-explained",
    savedAt: "Saved on Apr 6, 2026",
  },
  {
    documentId: "newtons-laws-of-motion",
    savedAt: "Saved on Apr 5, 2026",
  },
];

const bookmarkedDocuments = savedRows
  .map((item) => {
    const document = mockDocuments.find(
      (entry) => entry.id === item.documentId
    );

    return document
      ? {
          ...document,
          savedAt: item.savedAt,
        }
      : null;
  })
  .filter(Boolean);

const Bookmarks = () => {
  return (
    <main className="min-h-[calc(100vh-117px)] bg-[#f6f9ff] px-10 py-10">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3 text-slate-950">
            <Bookmark className="h-7 w-7 text-[#f59e0b]" strokeWidth={1.8} />
            <h1 className="text-[2.3rem] font-medium tracking-tight">
              Bookmark
            </h1>
          </div>

          <p className="text-[1.08rem] font-normal text-slate-500">
            Articles you saved to read again later
          </p>
        </div>

        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
          {bookmarkedDocuments.map((document) => (
            <article
              key={document.id}
              className="flex items-center justify-between gap-6 border-b border-slate-100 px-6 py-6 last:border-b-0"
            >
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-[0.98rem] font-normal text-slate-500">
                  <span className="rounded-full bg-[#fbf1dd] px-3 py-1 text-[0.9rem] text-slate-900">
                    {document.subject}
                  </span>
                  <span>{document.savedAt}</span>
                </div>

                <Link
                  to={`/documents/${document.id}`}
                  className="block text-[1.65rem] font-medium tracking-tight text-slate-950"
                >
                  {document.title}
                </Link>

                <p className="mt-2 text-[1.05rem] font-normal text-slate-500">
                  {document.author}
                </p>
              </div>

              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500"
              >
                <Trash2 className="h-5 w-5" strokeWidth={1.7} />
              </button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default Bookmarks;
