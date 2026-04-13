import React, { useMemo } from "react";
import { BookOpen } from "lucide-react";
import CategoryCard from "../../components/admin/CategoryCard";
import useMaterials from "../../hooks/useMaterials.js";

const AdminCategories = () => {
  const { materials, isLoading } = useMaterials();

  // Build category summaries dynamically from real data
  const categories = useMemo(() => {
    const summary = materials.reduce((acc, doc) => {
      const subject = doc.subject;
      if (!subject) return acc;

      if (!acc[subject]) {
        acc[subject] = { subject, count: 0, views: 0, downloads: 0 };
      }

      acc[subject].count += 1;
      acc[subject].views += doc.views || 0;
      acc[subject].downloads += doc.downloads || 0;
      return acc;
    }, {});

    return Object.values(summary).sort((a, b) => b.count - a.count);
  }, [materials]);

  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <h1 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl lg:text-[3rem]">
        Categories
      </h1>
      <p className="mt-3 max-w-2xl text-base font-normal text-slate-500 sm:text-[1.08rem] lg:text-[1.15rem]">
        Browse knowledge by subject area.
      </p>

      {isLoading ? (
        <div className="mt-10 py-10 text-center text-slate-500">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="mt-10 py-10 text-center text-slate-500">No categories found.</div>
      ) : (
        <section className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.subject} category={category} />
          ))}
        </section>
      )}
    </main>
  );
};

export default AdminCategories;
