import React from "react";
import { FileText, ThumbsUp, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteMaterial } from "../api/materials.js";
import useMaterials from "../hooks/useMaterials.js";
import { useAppContext } from "../context/useAppContext.js";

const Uploads = () => {
  const { user } = useAppContext();
  const userId = user?._id || user?.id;
  const { materials, isLoading, setMaterials } = useMaterials({
    userId,
    skip: !userId,
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteMaterial(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      toast.success("Document deleted successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to delete document.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-97px)] bg-[#f6f9ff] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-[1440px]">
        <h1 className="mb-6 text-3xl font-medium tracking-tight text-slate-950 sm:text-[2rem]">
          Uploads
        </h1>

        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
          <div className="hidden grid-cols-[minmax(0,1.7fr)_120px_140px_140px_140px] border-b border-slate-200 px-8 py-5 text-[1rem] font-medium text-slate-700 lg:grid">
            <div>Document Title</div>
            <div className="text-center">Downloads</div>
            <div className="text-center">Ratings</div>
            <div className="text-center">Anonymous</div>
            <div className="text-center">Actions</div>
          </div>

          <div>
            {isLoading ? (
              <div className="px-8 py-10 text-center text-slate-500">Loading your uploads...</div>
            ) : materials.length === 0 ? (
               <div className="px-8 py-10 text-center text-slate-500">You haven't uploaded any documents yet.</div>
            ) : (
              materials.map((row) => (
                <article
                  key={row.id}
                  className="grid grid-cols-1 gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1.7fr)_120px_140px_140px_140px] lg:items-center lg:gap-0 lg:px-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[var(--theme-blue)]">
                      <FileText className="h-5 w-5" strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="mb-1 truncate text-[1.2rem] font-normal text-slate-900">
                        {row.title}
                      </h2>
                      <p className="text-[0.98rem] font-normal text-slate-500">
                        {row.subject} &bull; {row.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-[0.98rem] font-normal text-slate-700 lg:block lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0 lg:text-center lg:text-[1.05rem]">
                    <span className="font-medium text-slate-500 lg:hidden">Downloads</span>
                    {row.downloads}
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-[0.98rem] font-normal text-slate-500 lg:justify-center lg:gap-2 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0 lg:text-[1rem]">
                    <span className="font-medium text-slate-500 lg:hidden">Ratings</span>
                    <span className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4" strokeWidth={1.7} />
                      N/A
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-[0.98rem] font-normal text-slate-500 lg:block lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0 lg:text-center lg:text-[1rem]">
                    <span className="font-medium text-slate-500 lg:hidden">Anonymous</span>
                    No
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 lg:justify-center lg:gap-4 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0">
                    <span className="font-medium text-slate-500 lg:hidden">Actions</span>
                    <div className="flex items-center gap-3">
                      <button
                        title="Edit Document"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        onClick={() => toast("Edit functionality coming soon!", { icon: "✏️" })}
                      >
                        <Pencil className="h-4 w-4" strokeWidth={2} />
                      </button>
                      <button
                        title="Delete Document"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        onClick={() => handleDelete(row.id)}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Uploads;
