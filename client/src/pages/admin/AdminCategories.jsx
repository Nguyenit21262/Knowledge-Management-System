import React from "react";
import {
  Atom,
  Calculator,
  FlaskConical,
  Globe,
  Leaf,
  PenLine,
} from "lucide-react";
import CategoryCard from "../../components/admin/CategoryCard";
import { getSubjectSummaries } from "../../lib/mockDocuments";

const categoryConfigs = {
  Biology: {
    icon: Leaf,
    iconBackground: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  Chemistry: {
    icon: FlaskConical,
    iconBackground: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  Physics: {
    icon: Atom,
    iconBackground: "bg-slate-200",
    iconColor: "text-slate-700",
  },
  Mathematics: {
    icon: Calculator,
    iconBackground: "bg-rose-100",
    iconColor: "text-rose-500",
  },
  English: {
    icon: PenLine,
    iconBackground: "bg-orange-100",
    iconColor: "text-orange-700",
  },
  History: {
    icon: Globe,
    iconBackground: "bg-blue-100",
    iconColor: "text-blue-700",
  },
};

const categoryOrder = [
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "English",
  "History",
];

const AdminCategories = () => {
  const categoryMap = new Map(
    getSubjectSummaries().map((summary) => [summary.subject, summary])
  );

  const categories = categoryOrder
    .map((subject) => {
      const summary = categoryMap.get(subject);

      if (!summary) {
        return null;
      }

      return {
        ...summary,
        ...categoryConfigs[subject],
      };
    })
    .filter(Boolean);

  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <h1 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl lg:text-[3rem]">
        Categories
      </h1>
      <p className="mt-3 max-w-2xl text-base font-normal text-slate-500 sm:text-[1.08rem] lg:text-[1.15rem]">
        Browse knowledge by subject area.
      </p>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.subject} category={category} />
        ))}
      </section>
    </main>
  );
};

export default AdminCategories;
