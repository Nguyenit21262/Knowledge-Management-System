import React, { useState } from 'react'
import { Bookmark, CalendarDays, Download, FileText, UserRound, Video, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/useAppContext.js'
import { toggleBookmark } from '../api/users.js'
import { incrementDownload } from '../api/materials.js'

const iconMap = {
  PDF: FileText,
  VIDEO: Video,
}

const DocumentOverview = ({ document }) => {
  const ResourceIcon = iconMap[document.type] || FileText
  const { user, refreshCurrentUser } = useAppContext()
  
  const isBookmarked = user?.bookmarks?.includes(document.id) || false
  const [isToggling, setIsToggling] = useState(false)

  const handleToggleBookmark = async () => {
    if (!user) {
      return toast.error("Please log in to save bookmarks.");
    }
    
    try {
      setIsToggling(true);
      await toggleBookmark(document.id);
      await refreshCurrentUser();
      toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
    } catch {
      toast.error("Failed to save bookmark");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (!document.fileUrl) {
        return toast.error("File URL is missing for this document.");
      }
      
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const hardDownloadUrl = `${baseURL}/api/materials/${document.id}/download-file`;
        
      window.location.href = hardDownloadUrl;
      
      await incrementDownload(document.id);
      // Optional: you can manually bump UI state so it shows immediately
      document.downloads += 1;
      toast.success("Download started!");
    } catch (error) {
      // Ignore background registration error to not annoy the user
      // if the file opened successfully.
    }
  };

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
            onClick={handleToggleBookmark}
            disabled={isToggling}
            className={`inline-flex items-center gap-3 rounded-2xl border transition-colors px-7 py-4 text-[1.08rem] font-normal ${
              isBookmarked 
                ? "border-[#f59e0b] bg-[#fbf1dd] text-[#d97706]" 
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Bookmark 
               className={`h-5 w-5 ${isBookmarked ? "text-[#d97706] fill-[#d97706]" : "text-[#f59e0b]"}`} 
               strokeWidth={1.8} 
            />
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-3 rounded-2xl bg-[var(--theme-blue)] px-8 py-4 text-[1.1rem] font-normal text-white hover:bg-blue-900 transition-colors"
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-12 lg:gap-x-24 gap-y-10">
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

          <div className="flex items-start gap-4">
            <Eye className="mt-1 h-8 w-8 text-slate-400" strokeWidth={1.7} />
            <div>
              <p className="text-[1.05rem] text-slate-500">Views</p>
              <p className="text-[1.1rem] font-medium text-slate-950">{document.views || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DocumentOverview
