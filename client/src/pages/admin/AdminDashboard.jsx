import React from "react";
import { BookOpen, FolderOpen, TrendingUp, Users } from "lucide-react";
import { mockDocuments } from "../../lib/mockDocuments";

const topicColors = [
  "bg-amber-100",
  "bg-emerald-100",
  "bg-sky-100",
  "bg-rose-100",
];

const totalViews = mockDocuments.reduce(
  (sum, document) => sum + document.views,
  0
);
const totalSubjects = new Set(mockDocuments.map((document) => document.subject))
  .size;
const activeStudents = new Set(
  mockDocuments.flatMap((document) =>
    document.comments
      .filter((comment) => comment.role === "student")
      .map((comment) => comment.author)
  )
).size;

const stats = [
  {
    label: "Total Articles",
    value: mockDocuments.length.toString(),
    note: "Shared across the school library",
    icon: BookOpen,
  },
  {
    label: "Active Students",
    value: activeStudents.toString(),
    note: "Students engaging in discussions",
    icon: Users,
  },
  {
    label: "Categories",
    value: totalSubjects.toString(),
    note: "Subjects available in the knowledge base",
    icon: FolderOpen,
  },
  {
    label: "Views This Month",
    value: totalViews.toLocaleString(),
    note: "Across the current hard-coded materials",
    icon: TrendingUp,
  },
];

const recentArticles = mockDocuments.slice(0, 3);

const subjectSummary = Object.entries(
  mockDocuments.reduce((summary, document) => {
    if (!summary[document.subject]) {
      summary[document.subject] = {
        count: 0,
        views: 0,
      };
    }

    summary[document.subject].count += 1;
    summary[document.subject].views += document.views;
    return summary;
  }, {})
)
  .sort((left, right) => right[1].views - left[1].views)
  .slice(0, 4)
  .map(([label, values], index) => ({
    label,
    count: `${values.count} material${values.count > 1 ? "s" : ""}`,
    color: topicColors[index],
  }));

const AdminDashboard = () => {
  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <h1 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl lg:text-[3rem]">
        Dashboard
      </h1>
      <p className="mt-3 max-w-2xl text-base font-normal text-slate-500 sm:text-[1.08rem] lg:text-[1.15rem]">
        Welcome back! Here's what's happening in your knowledge base.
      </p>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="rounded-md border border-slate-200 bg-white px-5 py-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:px-6 sm:py-6 lg:px-8 lg:py-7"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <p className="text-[0.9rem] font-medium uppercase tracking-[0.06em] text-slate-500 sm:text-[0.98rem]">
                  {item.label}
                </p>
                <Icon className="h-5 w-5 text-[#f59e0b]" strokeWidth={1.8} />
              </div>

              <p className="text-[1.8rem] font-medium text-slate-950 sm:text-[2rem] lg:text-[2.1rem]">
                {item.value}
              </p>
              <p className="mt-2 text-[0.98rem] font-normal text-slate-500 sm:text-[1rem]">
                {item.note}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,0.9fr)] xl:gap-8">
        <article className="rounded-md border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6 sm:py-6 lg:px-8">
            <h2 className="text-2xl font-medium tracking-tight text-slate-950 sm:text-[1.75rem] lg:text-[2rem]">
              Recent Articles
            </h2>
          </div>

          <div>
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="border-b border-slate-100 px-5 py-5 last:border-b-0 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
              >
                <p className="text-[1.05rem] font-medium text-slate-950 sm:text-[1.15rem] lg:text-[1.2rem]">
                  {article.title}
                </p>
                <p className="mt-2 text-[0.96rem] font-normal text-slate-500 sm:text-[1rem]">
                  {article.author} - {article.publishedAgo}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6 sm:py-6 lg:px-8">
            <h2 className="text-2xl font-medium tracking-tight text-slate-950 sm:text-[1.75rem] lg:text-[2rem]">
              Popular Topics
            </h2>
          </div>

          <div className="space-y-5 px-5 py-5 sm:space-y-6 sm:px-6 sm:py-6 lg:space-y-7 lg:px-8 lg:py-7">
            {subjectSummary.map((topic) => (
              <div
                key={topic.label}
                className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className={`h-4 w-4 rounded-full ${topic.color}`} />
                  <p className="text-[1.05rem] font-normal text-slate-900 sm:text-[1.15rem]">
                    {topic.label}
                  </p>
                </div>

                <p className="text-[0.96rem] font-normal text-slate-500 sm:text-[1rem]">
                  {topic.count}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
};

export default AdminDashboard;
