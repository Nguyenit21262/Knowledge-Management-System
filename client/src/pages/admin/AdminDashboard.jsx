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
    <main className="px-8 py-10">
      <h1 className="text-[3rem] font-medium tracking-tight text-slate-950">
        Dashboard
      </h1>
      <p className="mt-3 text-[1.15rem] font-normal text-slate-500">
        Welcome back! Here's what's happening in your knowledge base.
      </p>

      <section className="mt-10 grid grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="rounded-md border border-slate-200 bg-white px-8 py-7 shadow-[0_6px_20px_rgba(15,23,42,0.04)]"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <p className="text-[0.98rem] font-medium uppercase tracking-[0.06em] text-slate-500">
                  {item.label}
                </p>
                <Icon className="h-5 w-5 text-[#f59e0b]" strokeWidth={1.8} />
              </div>

              <p className="text-[2.1rem] font-medium text-slate-950">
                {item.value}
              </p>
              <p className="mt-2 text-[1rem] font-normal text-slate-500">
                {item.note}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-10 grid grid-cols-[minmax(0,1.8fr)_minmax(320px,0.9fr)] gap-8">
        <article className="rounded-md border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <div className="border-b border-slate-200 px-8 py-6">
            <h2 className="text-[2rem] font-medium tracking-tight text-slate-950">
              Recent Articles
            </h2>
          </div>

          <div>
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="border-b border-slate-100 px-8 py-7 last:border-b-0"
              >
                <p className="text-[1.2rem] font-medium text-slate-950">
                  {article.title}
                </p>
                <p className="mt-2 text-[1rem] font-normal text-slate-500">
                  {article.author} - {article.publishedAgo}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <div className="border-b border-slate-200 px-8 py-6">
            <h2 className="text-[2rem] font-medium tracking-tight text-slate-950">
              Popular Topics
            </h2>
          </div>

          <div className="space-y-7 px-8 py-7">
            {subjectSummary.map((topic) => (
              <div
                key={topic.label}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className={`h-4 w-4 rounded-full ${topic.color}`} />
                  <p className="text-[1.15rem] font-normal text-slate-900">
                    {topic.label}
                  </p>
                </div>

                <p className="text-[1rem] font-normal text-slate-500">
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
