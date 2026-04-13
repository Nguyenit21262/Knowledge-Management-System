import React from "react";
import { BookOpen, CalendarDays, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const KnowledgeBaseCard = ({ document }) => {
  return (
    <Link
      to={`/documents/${document.id}`}
      className="block border border-slate-200  px-5 py-5  sm:px-6 sm:py-6 lg:px-8 lg:py-8"
    >
      <div className="mb-5 sm:mb-6">
        <span className="inline-flex rounded-md  px-3 py-1.5 text-[0.92rem] font-normal text-slate-900 sm:px-4 sm:py-2 sm:text-[1rem]">
          {document.subject}
        </span>
      </div>

      <h2 className="mb-4 text-[1.6rem] leading-tight font-medium tracking-tight text-slate-950 sm:mb-5 sm:text-[1.8rem] lg:text-[2rem]">
        {document.title}
      </h2>

      <p className="mb-6 text-[1rem] leading-8 text-slate-500 sm:mb-7 sm:text-[1.05rem] lg:text-[1.1rem] lg:leading-9">
        {document.description}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-[0.95rem] font-normal text-slate-500 sm:gap-6 sm:text-[1rem]">
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
