import React from "react";
import { FileText, ThumbsUp } from "lucide-react";

const uploadRows = [
  {
    id: 1,
    title: "Midterm Sample Exam",
    note: "Your document was already on the website.",
    views: 0,
    rating: "None",
    anonymous: "No",
    status: "Rejected",
    statusClass: "bg-red-100 text-red-600",
  },
  {
    id: 2,
    title: "Lab4 - Lab4 practice",
    note: "Your document was already on the website.",
    views: 12,
    rating: "100% (1)",
    anonymous: "No",
    status: "Published",
    statusClass: "bg-green-100 text-green-600",
  },
];

const Uploads = () => {
  return (
    <main className="min-h-[calc(100vh-97px)] bg-[#f6f9ff] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-[1440px]">
        <h1 className="mb-6 text-3xl font-medium tracking-tight text-slate-950 sm:text-[2rem]">
          Uploads
        </h1>

        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
          <div className="hidden grid-cols-[minmax(0,1.7fr)_120px_140px_140px_140px] border-b border-slate-200 px-8 py-5 text-[1rem] font-medium text-slate-700 lg:grid">
            <div>Document Title</div>
            <div className="text-center">Views</div>
            <div className="text-center">Ratings</div>
            <div className="text-center">Anonymous</div>
            <div className="text-center">Status</div>
          </div>

          <div>
            {uploadRows.map((row) => (
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
                      {row.note}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-[0.98rem] font-normal text-slate-700 lg:block lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0 lg:text-center lg:text-[1.05rem]">
                  <span className="font-medium text-slate-500 lg:hidden">Views</span>
                  {row.views}
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-[0.98rem] font-normal text-slate-500 lg:justify-center lg:gap-2 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0 lg:text-[1rem]">
                  <span className="font-medium text-slate-500 lg:hidden">Ratings</span>
                  <span className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" strokeWidth={1.7} />
                    {row.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-[0.98rem] font-normal text-slate-500 lg:block lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0 lg:text-center lg:text-[1rem]">
                  <span className="font-medium text-slate-500 lg:hidden">Anonymous</span>
                  {row.anonymous}
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 lg:justify-center lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0">
                  <span className="font-medium text-slate-500 lg:hidden">Status</span>
                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-[0.95rem] font-normal ${row.statusClass}`}
                  >
                    {row.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Uploads;
