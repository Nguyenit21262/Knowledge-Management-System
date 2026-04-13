import React, { useEffect, useMemo } from "react";
import { Eye, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import useMaterials from "../hooks/useMaterials.js";
import { formatDate } from "../utils/formatters.js";
import toast from "react-hot-toast";

const Home = () => {
  const { materials, isLoading, error } = useMaterials();

  useEffect(() => {
    if (error) toast.error("Failed to load documents.");
  }, [error]);

  // Compute Featured: Top 4 by views
  const featuredDocuments = useMemo(
    () => [...materials].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4),
    [materials],
  );

  // Compute Recent: Already sorted by createdAt descending from the backend
  const recentDocuments = materials;

  return (
    <main className="min-h-[calc(100vh-97px)] bg-[#f6f9ff] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-[1440px] space-y-8 lg:space-y-10">
        <section>
          <div className="mb-6">
            <h1 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-[2.1rem]">
              Featured Articles
            </h1>
          </div>

          {isLoading ? (
            <div className="text-slate-500">Loading featured articles...</div>
          ) : featuredDocuments.length === 0 ? (
            <div className="text-slate-500">No articles available.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
              {featuredDocuments.map((document) => (
                <Link
                  key={document.id}
                  to={`/documents/${document.id}`}
                  className="rounded-[24px] border border-slate-200 bg-white px-5 py-5 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:px-6 sm:py-6"
                >
                  <span className="inline-flex rounded-full bg-[#fbf1dd] px-3 py-1 text-[0.9rem] font-normal text-slate-900">
                    {document.subject}
                  </span>

                  <h2 className="content-clamp-3 mt-5 text-[1.9rem] leading-tight font-medium tracking-tight text-slate-950">
                    {document.title}
                  </h2>

                  <p className="content-clamp-4 mt-4 text-[1rem] leading-8 font-normal text-slate-500">
                    {document.description || "No description available."}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-4 text-[0.95rem] font-normal text-slate-500 sm:gap-6 sm:text-[0.98rem]">
                    <div className="flex items-center gap-2">
                      <UserRound className="h-4 w-4" strokeWidth={1.7} />
                      <span>{document.author}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" strokeWidth={1.7} />
                      <span>{document.views || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-[2.1rem]">
              Recent Articles
            </h2>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
            {isLoading ? (
              <div className="px-5 py-8 text-slate-500 text-center">Loading recent articles...</div>
            ) : recentDocuments.length === 0 ? (
              <div className="px-5 py-8 text-slate-500 text-center">No recent articles available.</div>
            ) : (
              recentDocuments.map((document) => (
                <Link
                  key={document.id}
                  to={`/documents/${document.id}`}
                  className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:gap-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-[0.98rem] font-normal text-slate-500">
                      <span className="rounded-full bg-[#fbf1dd] px-3 py-1 text-[0.9rem] text-slate-900">
                        {document.subject}
                      </span>
                      <span>{formatDate(document.date)}</span>
                    </div>

                    <h3 className="text-[1.25rem] font-medium tracking-tight text-slate-950 sm:text-[1.35rem] lg:text-[1.45rem]">
                      {document.title}
                    </h3>
                    <p className="mt-2 text-[1rem] font-normal text-slate-500">
                      {document.author}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-[1rem] font-normal text-slate-500">
                    <Eye className="h-4 w-4" strokeWidth={1.7} />
                    <span>{document.views || 0}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
