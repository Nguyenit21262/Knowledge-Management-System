import React from 'react'
import { Link } from 'react-router-dom'
import { Download, FileText, MessageSquare, Video } from 'lucide-react'
import { mockDocuments } from '../lib/mockDocuments'

const iconMap = {
  PDF: FileText,
  VIDEO: Video,
}

const DocumentCard = () => {
  return (
    <section className="mx-auto max-w-screen-2xl px-10 py-10">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-8">
        {mockDocuments.map((resource) => {
          const ResourceIcon = iconMap[resource.type] || FileText

          return (
            <Link
              key={resource.id}
              to={`/documents/${resource.id}`}
              className="block rounded-[22px] border border-slate-200 bg-white px-9 py-8 shadow-[0_4px_14px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-3 text-[#4f46ff]">
                  <ResourceIcon className="h-6 w-6" strokeWidth={1.8} />
                  <span className="text-[1.05rem] font-normal">{resource.type}</span>
                </div>

                <span className="rounded-xl bg-slate-100 px-4 py-2 text-[0.95rem] font-normal text-slate-700">
                  {resource.subject}
                </span>
              </div>

              <h2 className="mb-4 text-[2rem] leading-tight font-semibold tracking-tight text-slate-950">
                {resource.title}
              </h2>

              <p className="mb-7 max-w-[34ch] text-[1.15rem] leading-8 text-slate-600">
                {resource.description}
              </p>

              <div className="space-y-3 text-[1.1rem] text-slate-600">
                <p>
                  <span className="mr-2 font-medium text-slate-700">Category:</span>
                  {resource.category}
                </p>
                <p>
                  <span className="mr-2 font-medium text-slate-700">By:</span>
                  {resource.author}
                </p>
                <p>
                  <span className="mr-2 font-medium text-slate-700">Date:</span>
                  {resource.date}
                </p>
              </div>

              <div className="mt-7 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-8 text-[1.1rem] text-slate-500">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5" strokeWidth={1.8} />
                    <span>{resource.downloads}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" strokeWidth={1.8} />
                    <span>{resource.commentsCount}</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default DocumentCard
