import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const Icon = category.icon;

  return (
    <Link
      to={`/admin/knowledge-base?subject=${encodeURIComponent(category.subject)}`}
      className="flex items-center gap-6 rounded-md border border-slate-200 bg-white px-7 py-7 shadow-[0_6px_20px_rgba(15,23,42,0.04)]"
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-md ${category.iconBackground} ${category.iconColor}`}
      >
        <Icon className="h-8 w-8" strokeWidth={1.7} />
      </div>

      <div>
        <h2 className="text-[1.9rem] font-medium tracking-tight text-slate-950">
          {category.subject}
        </h2>
        <p className="mt-1 text-[1.05rem] font-normal text-slate-500">
          {category.count} {category.count > 1 ? "materials" : "material"}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
