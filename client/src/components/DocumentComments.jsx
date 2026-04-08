import React from 'react'
import { MessageSquare, Send, UserRound } from 'lucide-react'

const roleClasses = {
  student: 'bg-[#fbf1dd] text-slate-700',
  teacher: 'bg-slate-100 text-slate-700',
}

const DocumentComments = ({ document }) => {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white px-8 py-10 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <div className="mb-10 flex items-center gap-3 text-slate-950">
        <MessageSquare className="h-7 w-7 text-[#f59e0b]" strokeWidth={1.8} />
        <h2 className="text-[2rem] font-medium tracking-tight">
          Comments ({document.comments.length})
        </h2>
      </div>

      <div className="mb-12">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fbf1dd] text-[#f59e0b]">
            <UserRound className="h-8 w-8" strokeWidth={1.7} />
          </div>

          <textarea
            rows="4"
            placeholder="Add a comment or ask a question..."
            className="min-h-[145px] flex-1 resize-none rounded-3xl border border-slate-200 px-6 py-5 text-[1.1rem] text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-2xl bg-[var(--theme-blue)] px-8 py-4 text-[1.1rem] font-normal text-white"
          >
            <Send className="h-5 w-5" strokeWidth={1.8} />
            Post Comment
          </button>
        </div>
      </div>

      <div className="space-y-10">
        {document.comments.map((comment) => (
          <article key={comment.id} className="flex items-start gap-4">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <UserRound className="h-7 w-7" strokeWidth={1.7} />
            </div>

            <div className="flex-1">
              <div className="mb-2 flex items-center gap-4">
                <h3 className="text-[1.1rem] font-normal text-slate-950">{comment.author}</h3>
                <span
                  className={`rounded-lg px-3 py-1 text-[0.9rem] font-normal capitalize ${
                    roleClasses[comment.role]
                  }`}
                >
                  {comment.role}
                </span>
                <span className="text-[1rem] text-slate-500">{comment.date}</span>
              </div>

              <p className="text-[1.1rem] leading-9 text-slate-700">{comment.content}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DocumentComments
