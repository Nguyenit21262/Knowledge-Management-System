import React, { useState } from "react";
import {
  FileText,
  Image,
  Video,
  FileSpreadsheet,
  Presentation,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  AlertCircle,
} from "lucide-react";
import { API_BASE_URL } from "../api/httpClient.js";

const getFileExtension = (url) => {
  if (!url) return "";
  const filename = url.split("/").pop().split("?")[0];
  return filename.split(".").pop().toLowerCase();
};

const FILE_CATEGORIES = {
  pdf: {
    label: "PDF Document",
    icon: FileText,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  image: {
    label: "Image",
    icon: Image,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  video: {
    label: "Video",
    icon: Video,
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
  word: {
    label: "Word Document",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  powerpoint: {
    label: "Presentation",
    icon: Presentation,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  spreadsheet: {
    label: "Spreadsheet",
    icon: FileSpreadsheet,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  other: {
    label: "Document",
    icon: FileText,
    color: "text-slate-500",
    bg: "bg-slate-50",
  },
};

const getFileCategory = (url) => {
  const ext = getFileExtension(url);

  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].includes(ext))
    return "image";
  if (["mp4", "mov", "avi", "mkv", "webm", "ogg"].includes(ext)) return "video";
  if (["doc", "docx"].includes(ext)) return "word";
  if (["ppt", "pptx"].includes(ext)) return "powerpoint";
  if (["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
  return "other";
};

const PdfViewer = ({ src, isExpanded, onToggleExpand }) => (
  <div
    className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 transition-all duration-300 ${
      isExpanded ? "h-[95vh]" : "h-[800px]"
    }`}
  >
    <iframe
      src={src}
      title="PDF Viewer"
      className="h-full w-full"
      style={{ border: "none" }}
    />

    <button
      type="button"
      onClick={onToggleExpand}
      className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-lg backdrop-blur-sm transition hover:bg-white"
      title={isExpanded ? "Collapse viewer" : "Expand viewer"}
    >
      {isExpanded ? (
        <Minimize2 className="h-4 w-4" strokeWidth={2} />
      ) : (
        <Maximize2 className="h-4 w-4" strokeWidth={2} />
      )}
    </button>
  </div>
);

const ImageViewer = ({ src, title }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <img
          src={src}
          alt={title || "Document image"}
          className="mx-auto max-h-[700px] w-auto cursor-zoom-in object-contain p-4"
          onClick={() => setIsZoomed(true)}
        />
      </div>

      {/* Fullscreen zoom overlay */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={src}
            alt={title || "Document image"}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </>
  );
};

const VideoViewer = ({ src }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
    <video
      src={src}
      controls
      className="mx-auto max-h-[600px] w-full"
      preload="metadata"
    >
      Your browser does not support the video tag.
    </video>
  </div>
);

const UnsupportedPreview = ({ category, fileUrl }) => {
  const meta = FILE_CATEGORIES[category] || FILE_CATEGORIES.other;
  const Icon = meta.icon;

  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <div
        className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl ${meta.bg}`}
      >
        <Icon className={`h-10 w-10 ${meta.color}`} strokeWidth={1.5} />
      </div>
      <p className="mb-2 text-[1.15rem] font-medium text-slate-900">
        Preview not available for {meta.label} files
      </p>
      <p className="mb-6 text-[1rem] text-slate-500">
        Download the file to view its full content
      </p>
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--theme-blue)] px-6 py-3 text-[1rem] font-medium text-white transition hover:bg-blue-900"
      >
        <Eye className="h-4 w-4" strokeWidth={2} />
        Open in New Tab
      </a>
    </div>
  );
};

// const TextContentSection = ({ contentText }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   if (!contentText?.trim()) return null;

//   const lines = contentText.split("\n");
//   const isLong = lines.length > 20 || contentText.length > 2000;
//   const displayText = isExpanded || !isLong
//     ? contentText
//     : contentText.slice(0, 2000) + "...";

//   return (
//     <div className="mt-6">
//       <div className="mb-4 flex items-center justify-between">
//         <h3 className="text-[1.15rem] font-medium text-slate-950">
//           Extracted Text Content
//         </h3>

//         {isLong && (
//           <button
//             type="button"
//             onClick={() => setIsExpanded((prev) => !prev)}
//             className="flex items-center gap-2 text-[0.95rem] font-normal text-[var(--theme-blue)] transition hover:opacity-80"
//           >
//             {isExpanded ? (
//               <>
//                 <EyeOff className="h-4 w-4" strokeWidth={1.8} />
//                 Show Less
//               </>
//             ) : (
//               <>
//                 <Eye className="h-4 w-4" strokeWidth={1.8} />
//                 Show All
//               </>
//             )}
//           </button>
//         )}
//       </div>

//       <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
//         <pre className="whitespace-pre-wrap break-words font-sans text-[0.98rem] leading-7 text-slate-700">
//           {displayText}
//         </pre>
//       </div>
//     </div>
//   );
// };

const FileViewer = ({ document }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!document?.fileUrl) {
    return (
      <section className="rounded-[28px] ">
        <div className="flex items-center gap-3 text-slate-400">
          <AlertCircle className="h-6 w-6" strokeWidth={1.8} />
          <p className="text-[1.05rem]">No file attached to this document.</p>
        </div>
      </section>
    );
  }

  const fullUrl = `${API_BASE_URL}${document.fileUrl}`;
  const category = getFileCategory(document.fileUrl);
  const meta = FILE_CATEGORIES[category] || FILE_CATEGORIES.other;
  const Icon = meta.icon;

  return (
    <section className="rounded-[28px]  bg-white px-8 py-10 ">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.bg}`}
          >
            <Icon className={`h-5 w-5 ${meta.color}`} strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-[1.35rem] font-medium tracking-tight text-slate-950">
              File Preview
            </h2>
            <p className="text-[0.92rem] text-slate-500">{meta.label}</p>
          </div>
        </div>

        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2  px-4 py-2.5 text-[0.95rem] font-normal text-slate-700 transition hover:bg-slate-50"
        >
          <Eye className="h-4 w-4" strokeWidth={1.8} />
          Open in New Tab
        </a>
      </div>

      {/* File viewer by category */}
      {category === "pdf" && (
        <PdfViewer
          src={fullUrl}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded((prev) => !prev)}
        />
      )}

      {category === "image" && (
        <ImageViewer src={fullUrl} title={document.title} />
      )}

      {category === "video" && <VideoViewer src={fullUrl} />}

      {!["pdf", "image", "video"].includes(category) && (
        <UnsupportedPreview category={category} fileUrl={fullUrl} />
      )}

      {/* Extracted text content — mainly useful for PDFs and text-based documents */}
      {/* <TextContentSection contentText={document.contentText} /> */}
    </section>
  );
};

export default FileViewer;
