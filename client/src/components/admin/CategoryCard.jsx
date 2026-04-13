import React from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const Icon = category.icon || BookOpen;
  const iconBg = category.iconBackground || "bg-amber-100";
  const iconColor = category.iconColor || "text-amber-700";

  return (
    <Link
      to={`/admin/knowledge-base?subject=${encodeURIComponent(category.subject)}`}
      className="flex flex-col items-start gap-4 rounded-md border border-slate-200 bg-white px-5 py-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-6 lg:gap-6 lg:px-7 lg:py-7"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-md sm:h-16 sm:w-16 ${iconBg} ${iconColor}`}
      >
        <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.7} />
      </div>

      <div>
        <h2 className="text-[1.55rem] font-medium tracking-tight text-slate-950 sm:text-[1.7rem] lg:text-[1.9rem]">
          {category.subject}
        </h2>
        <p className="mt-1 text-[0.98rem] font-normal text-slate-500 sm:text-[1.05rem]">
          {category.count} {category.count > 1 ? "materials" : "material"}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
