import React, { useState } from "react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Search,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const sidebarUser = {
  name: "tranvannguyen24012003",
  role: "Student",
  uploads: 6,
  upvotes: 2,
};

const Sidebar = ({ user = sidebarUser }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const isHomeActive = location.pathname === "/";
  const isBookmarksActive = location.pathname === "/bookmarks";
  const isSearchActive = location.pathname === "/search";
  const isUploadsActive = location.pathname === "/uploads";
  const userInitial = user.name.charAt(0).toUpperCase();

  return (
    <aside
      className={`sticky top-0 shrink-0 border-r border-slate-200 bg-white py-6 transition-all duration-300 ${
        isOpen ? "w-[320px] px-6" : "w-[104px] px-4"
      }`}
    >
      <div
        className={`mb-8 flex ${
          isOpen
            ? "items-start justify-between gap-4"
            : "flex-col items-center gap-4"
        }`}
      >
        <Link
          to="/profile"
          className={`flex ${isOpen ? "items-center gap-4" : "justify-center"}`}
        >
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[var(--theme-blue)] text-[1.35rem] font-medium text-white">
            {userInitial}
          </div>

          {isOpen && (
            <div>
              <h2 className="mb-1 text-[1.15rem] font-medium tracking-tight text-slate-950">
                Nguyen
              </h2>
              <p className="text-[0.95rem] font-normal text-slate-500">
                {user.role}
              </p>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 shadow-[0_2px_8px_rgba(15,23,42,0.08)]"
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
          ) : (
            <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
          )}
        </button>
      </div>

      {isOpen && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-[1.45rem] font-medium text-slate-950">
                {user.uploads}
              </p>
              <p className="text-[0.95rem] font-normal text-slate-500">
                Uploads
              </p>
            </div>

            <div>
              <p className="text-[1.45rem] font-medium text-slate-950">
                {user.upvotes}
              </p>
              <p className="text-[0.95rem] font-normal text-slate-500">
                Upvotes
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--theme-blue)] px-5 py-3 text-[1.05rem] font-medium text-white"
          >
            <span className="text-[1.35rem] leading-none">+</span>
            New
          </button>
        </>
      )}

      <nav>
        <Link
          to="/"
          className={`flex items-center py-3 text-[1.05rem] font-normal rounded-lg ${
            isHomeActive
              ? "bg-blue-400 text-white"
              : "bg-slate-50 text-slate-700"
          } ${isOpen ? "justify-start gap-3 px-4" : "justify-center px-0"}`}
        >
          <Home className="h-5 w-5 " strokeWidth={1.8} />
          {isOpen && "Home"}
        </Link>

        <Link
          to="/uploads"
          className={`mt-3 flex items-center py-3 text-[1.05rem] font-normal rounded-lg ${
            isUploadsActive
              ? "bg-blue-400 text-white"
              : "bg-slate-50 text-slate-700"
          } ${isOpen ? "justify-start gap-3 px-4" : "justify-center px-0"}`}
        >
          <FileText className="h-5 w-5" strokeWidth={1.8} />
          {isOpen && "Uploads"}
        </Link>

        <Link
          to="/search"
          className={`mt-3 flex items-center py-3 text-[1.05rem] font-normal rounded-lg ${
            isSearchActive
              ? "bg-blue-400 text-white"
              : "bg-slate-50 text-slate-700"
          } ${isOpen ? "justify-start gap-3 px-4" : "justify-center px-0"}`}
        >
          <Search className="h-5 w-5" strokeWidth={1.8} />
          {isOpen && "Search"}
        </Link>

        <Link
          to="/bookmarks"
          className={`mt-3 flex items-center py-3 text-[1.05rem] font-normal rounded-lg ${
            isBookmarksActive
              ? "bg-blue-400 text-white"
              : "bg-slate-50 text-slate-700"
          } ${isOpen ? "justify-start gap-3 px-4" : "justify-center px-0"}`}
        >
          <Bookmark className="h-5 w-5" strokeWidth={1.8} />
          {isOpen && "Bookmarks"}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
