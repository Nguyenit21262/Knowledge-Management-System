import React from "react";
import { Eye, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { mockDocuments } from "../lib/mockDocuments";

const featuredDocuments = mockDocuments.slice(0, 4);
const recentDocuments = mockDocuments;

const Home = () => {
  return (
    <main className="min-h-[calc(100vh-117px)] bg-[#f6f9ff] px-10 py-10">
      <div className="mx-auto max-w-screen-2xl space-y-10">
        <section>
          <div className="mb-6">
            <h1 className="text-[2.2rem] font-medium tracking-tight text-slate-950">
              Featured Articles
            </h1>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {featuredDocuments.map((document) => (
              <Link
                key={document.id}
                to={`/documents/${document.id}`}
                className="rounded-[24px] border border-slate-200 bg-white px-6 py-6 shadow-[0_6px_20px_rgba(15,23,42,0.05)]"
              >
                <span className="inline-flex rounded-full bg-[#fbf1dd] px-3 py-1 text-[0.9rem] font-normal text-slate-900">
                  {document.subject}
                </span>

                <h2 className="mt-5 text-[1.75rem] leading-tight font-medium tracking-tight text-slate-950">
                  {document.title}
                </h2>

                <p className="mt-4 text-[1.05rem] leading-8 font-normal text-slate-500">
                  {document.description}
                </p>

                <div className="mt-6 flex items-center gap-6 text-[0.98rem] font-normal text-slate-500">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4" strokeWidth={1.7} />
                    <span>{document.author}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" strokeWidth={1.7} />
                    <span>{document.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-[2.2rem] font-medium tracking-tight text-slate-950">
              Recent Articles
            </h2>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
            {recentDocuments.map((document) => (
              <Link
                key={document.id}
                to={`/documents/${document.id}`}
                className="flex items-center justify-between gap-6 border-b border-slate-100 px-6 py-6 last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-[0.98rem] font-normal text-slate-500">
                    <span className="rounded-full bg-[#fbf1dd] px-3 py-1 text-[0.9rem] text-slate-900">
                      {document.subject}
                    </span>
                    <span>{document.date}</span>
                  </div>

                  <h3 className="text-[1.45rem] font-medium tracking-tight text-slate-950">
                    {document.title}
                  </h3>
                  <p className="mt-2 text-[1rem] font-normal text-slate-500">
                    {document.author}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-[1rem] font-normal text-slate-500">
                  <Eye className="h-4 w-4" strokeWidth={1.7} />
                  <span>{document.views}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
