import React, { useEffect, useState, useMemo } from "react";
import { Bookmark, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import useMaterials from "../hooks/useMaterials.js";
import useBookmarks from "../hooks/useBookmarks.js";
import { useAppContext } from "../context/useAppContext.js";
import toast from "react-hot-toast";

const Bookmarks = () => {
  const { user } = useAppContext();
  const { handleRemoveBookmark, isToggling } = useBookmarks();

  const hasBookmarks = user?.bookmarks?.length > 0;
  const { materials, isLoading, error } = useMaterials({ skip: !hasBookmarks });

  useEffect(() => {
    if (error) toast.error("Failed to load your bookmarks.");
  }, [error]);

  // Filter materials to only show bookmarked ones
  const bookmarkedDocuments = useMemo(() => {
    if (!user?.bookmarks?.length) return [];
    const bookmarkSet = new Set(user.bookmarks.map(String));
    return materials.filter((doc) => bookmarkSet.has(String(doc.id)));
  }, [materials, user?.bookmarks]);

  const removeBookmark = async (documentId) => {
    await handleRemoveBookmark(documentId);
  };

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
          {isLoading ? (
            <div className="px-6 py-10 text-center text-[1.05rem] text-slate-500">
              Loading your bookmarks...
            </div>
          ) : bookmarkedDocuments.length === 0 ? (
            <div className="px-6 py-10 text-center text-[1.05rem] text-slate-500">
              You haven't bookmarked any documents yet.
            </div>
          ) : (
            bookmarkedDocuments.map((document) => (
              <article
                key={document.id}
                className="flex items-center justify-between gap-6 border-b border-slate-100 px-6 py-6 last:border-b-0 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-[0.98rem] font-normal text-slate-500">
                    <span className="rounded-full bg-[#fbf1dd] px-3 py-1 text-[0.9rem] text-slate-900">
                      {document.subject}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.9rem]">
                      {document.category}
                    </span>
                    <div className="flex items-center gap-1.5 ml-2 text-slate-400">
                      <Eye className="h-4 w-4" strokeWidth={1.7} />
                      <span className="text-[0.95rem]">{document.views || 0}</span>
                    </div>
                  </div>

                  <Link
                    to={`/documents/${document.id}`}
                    className="block text-[1.65rem] font-medium tracking-tight text-slate-950 hover:text-slate-700 transition-colors"
                  >
                    {document.title}
                  </Link>

                  <p className="mt-2 text-[1.05rem] font-normal text-slate-500">
                    {document.author}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeBookmark(document.id)}
                  disabled={isToggling}
                  title="Remove from bookmarks"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-5 w-5" strokeWidth={1.7} />
                </button>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
};

export default Bookmarks;
