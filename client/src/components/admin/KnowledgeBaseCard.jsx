import React from "react";
import { BookOpen, CalendarDays, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const KnowledgeBaseCard = ({ document }) => {
  return (
    <Link
      to={`/documents/${document.id}`}
      className="block rounded-md border border-slate-200 bg-white px-8 py-8 shadow-[0_6px_20px_rgba(15,23,42,0.04)]"
    >
      <div className="mb-6">
        <span className="inline-flex rounded-md bg-[#fbf1dd] px-4 py-2 text-[1rem] font-normal text-slate-900">
          {document.subject}
        </span>
      </div>

      <h2 className="mb-5 text-[2rem] leading-tight font-medium tracking-tight text-slate-950">
        {document.title}
      </h2>

      <p className="mb-7 text-[1.1rem] leading-9 text-slate-500">
        {document.description}
      </p>

      <div className="flex flex-wrap items-center gap-6 text-[1rem] font-normal text-slate-500">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" strokeWidth={1.7} />
          <span>{document.author}</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" strokeWidth={1.7} />
          <span>{document.date}</span>
        </div>

        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" strokeWidth={1.7} />
          <span>{document.views}</span>
        </div>
      </div>
    </Link>
  );
};

export default KnowledgeBaseCard;
