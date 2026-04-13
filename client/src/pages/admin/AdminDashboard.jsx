import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, FolderOpen, TrendingUp, Users } from "lucide-react";
import toast from "react-hot-toast";
import { getUsers } from "../../api/users.js";
import useMaterials from "../../hooks/useMaterials.js";
import { formatDate } from "../../utils/formatters.js";

const AdminDashboard = () => {
  const { materials, isLoading } = useMaterials();
  const [students, setStudents] = useState([]);
  const [isStudentsLoading, setIsStudentsLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      setIsStudentsLoading(true);

      try {
        const data = await getUsers({ role: "student" });
        setStudents(data);
      } catch (error) {
        toast.error(error.message || "Failed to load student statistics.");
      } finally {
        setIsStudentsLoading(false);
      }
    };

    loadStudents();
  }, []);

  const totalViews = useMemo(
    () => materials.reduce((sum, doc) => sum + (doc.views || 0), 0),
    [materials],
  );

  const totalSubjects = useMemo(
    () => new Set(materials.map((doc) => doc.subject)).size,
    [materials],
  );

  const activeStudents = useMemo(
    () => students.filter((student) => student.isActive).length,
    [students],
  );

  const inactiveStudents = useMemo(
    () => students.length - activeStudents,
    [students.length, activeStudents],
  );

  const stats = useMemo(
    () => [
      {
        label: "Total Articles",
        value: materials.length.toString(),
        note: "Shared across the school library",
        icon: BookOpen,
      },
      {
        label: "Active Students",
        value: activeStudents.toString(),
        note: `${inactiveStudents} inactive account${inactiveStudents === 1 ? "" : "s"}`,
        icon: Users,
      },
      {
        label: "Categories",
        value: totalSubjects.toString(),
        note: "Subjects available in the knowledge base",
        icon: FolderOpen,
      },
      {
        label: "Views",
        value: totalViews.toLocaleString(),
        note: "Total views across all materials",
        icon: TrendingUp,
      },
    ],
    [activeStudents, inactiveStudents, materials.length, totalSubjects, totalViews],
  );

  const recentArticles = useMemo(() => materials.slice(0, 5), [materials]);

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
                <Icon className="h-5 w-5 text-[#3b82f6]" strokeWidth={1.8} />
              </div>

              <p className="text-[1.8rem] font-medium text-slate-950 sm:text-[2rem] lg:text-[2.1rem]">
                {isLoading || isStudentsLoading ? "..." : item.value}
              </p>
              <p className="mt-2 text-[0.98rem] font-normal text-slate-500 sm:text-[1rem]">
                {item.note}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 sm:mt-10">
        <article className="rounded-md border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6 sm:py-6 lg:px-8">
            <h2 className="text-2xl font-medium tracking-tight text-slate-950 sm:text-[1.75rem] lg:text-[2rem]">
              Recent Articles
            </h2>
          </div>

          <div>
            {isLoading ? (
              <div className="px-8 py-10 text-center text-slate-500">Loading...</div>
            ) : recentArticles.length === 0 ? (
              <div className="px-8 py-10 text-center text-slate-500">No articles yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
                      <th className="px-5 py-4 text-[0.85rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                        Article
                      </th>
                      <th className="px-5 py-4 text-[0.85rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                        Author
                      </th>
                      <th className="px-5 py-4 text-[0.85rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                        Subject
                      </th>
                      <th className="px-5 py-4 text-[0.85rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                        Views
                      </th>
                      <th className="px-5 py-4 text-[0.85rem] font-semibold uppercase tracking-[0.05em] text-slate-500 sm:px-6 lg:px-8">
                        Published
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentArticles.map((article) => (
                      <tr
                        key={article.id}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="px-5 py-5 align-top sm:px-6 lg:px-8">
                          <div className="min-w-[220px]">
                            <p className="text-[1rem] font-medium text-slate-950 sm:text-[1.05rem]">
                              {article.title}
                            </p>
                            <p className="mt-1 text-[0.92rem] text-slate-500">
                              {article.category}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-5 text-[0.96rem] text-slate-600 sm:px-6 lg:px-8">
                          {article.author}
                        </td>
                        <td className="px-5 py-5 sm:px-6 lg:px-8">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[0.88rem] text-slate-700">
                            {article.subject}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-[0.96rem] text-slate-600 sm:px-6 lg:px-8">
                          {(article.views || 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-5 text-[0.96rem] text-slate-500 sm:px-6 lg:px-8">
                          {formatDate(article.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
};

export default AdminDashboard;
