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
    <main className="px-8 py-10">
      <h1 className="text-[3rem] font-medium tracking-tight text-slate-950">
        Categories
      </h1>
      <p className="mt-3 text-[1.15rem] font-normal text-slate-500">
        Browse knowledge by subject area.
      </p>

      <section className="mt-10 grid grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.subject} category={category} />
        ))}
      </section>
    </main>
  );
};

export default AdminCategories;
