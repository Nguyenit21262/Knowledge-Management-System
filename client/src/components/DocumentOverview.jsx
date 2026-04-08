import React from 'react'
import { Bookmark, CalendarDays, Download, FileText, UserRound, Video } from 'lucide-react'

const iconMap = {
  PDF: FileText,
  VIDEO: Video,
}

const DocumentOverview = ({ document }) => {
  const ResourceIcon = iconMap[document.type] || FileText

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white px-12 py-12 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <div className="mb-10 flex items-start justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-3xl bg-[#fbf1dd] text-[#f59e0b]">
            <ResourceIcon className="h-8 w-8" strokeWidth={1.8} />
          </div>
          <span className="rounded-full bg-[#fbf1dd] px-5 py-2 text-[1.05rem] font-normal text-slate-900">
            {document.subject}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-[1.08rem] font-normal text-slate-700"
          >
            <Bookmark className="h-5 w-5 text-[#f59e0b]" strokeWidth={1.8} />
            Bookmark
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-2xl bg-[var(--theme-blue)] px-8 py-4 text-[1.1rem] font-normal text-white"
          >
            <Download className="h-5 w-5" strokeWidth={1.8} />
            Download
          </button>
        </div>
      </div>

      <div className="mb-10">
        <h1 className="mb-6 text-[3rem] leading-tight font-medium tracking-tight text-slate-950">
          {document.title}
        </h1>
        <p className="text-[1.2rem] leading-9 text-slate-600">{document.description}</p>
      </div>

      <div className="border-t border-slate-200 pt-10">
        <div className="grid grid-cols-2 gap-x-24 gap-y-10">
          <div className="flex items-start gap-4">
            <UserRound className="mt-1 h-8 w-8 text-slate-400" strokeWidth={1.7} />
            <div>
              <p className="text-[1.05rem] text-slate-500">Uploaded by</p>
              <p className="text-[1.1rem] font-medium text-slate-950">{document.author}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <CalendarDays className="mt-1 h-8 w-8 text-slate-400" strokeWidth={1.7} />
            <div>
              <p className="text-[1.05rem] text-slate-500">Upload date</p>
              <p className="text-[1.1rem] font-medium text-slate-950">{document.date}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FileText className="mt-1 h-8 w-8 text-slate-400" strokeWidth={1.7} />
            <div>
              <p className="text-[1.05rem] text-slate-500">Category</p>
              <p className="text-[1.1rem] font-medium text-slate-950">{document.category}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Download className="mt-1 h-8 w-8 text-slate-400" strokeWidth={1.7} />
            <div>
              <p className="text-[1.05rem] text-slate-500">Downloads</p>
              <p className="text-[1.1rem] font-medium text-slate-950">{document.downloads}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DocumentOverview
