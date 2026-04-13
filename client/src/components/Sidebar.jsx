import React, { useState, useEffect } from "react";
import {
  Bookmark,
  ChevronLeft,
  FileText,
  Home,
  PanelLeft,
  Search,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getUserMaterials } from "../api/materials.js";

const sidebarUser = {
  name: "Guest User",
  role: "guest",
  uploads: 0,
  upvotes: 0,
};

const navItems = [
  { label: "Home", to: "/", icon: Home },
  { label: "Uploads", to: "/uploads", icon: FileText },
  { label: "Search", to: "/search", icon: Search },
  { label: "Bookmarks", to: "/bookmarks", icon: Bookmark },
];

const formatRole = (role = "") => {
  if (!role) {
    return "Guest";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
};

const Sidebar = ({ user = sidebarUser, isMobileOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const location = useLocation();
  const isExpanded = !isCollapsed;
  const safeUser = user || sidebarUser;
  const userInitial = safeUser.name.charAt(0).toUpperCase();

  useEffect(() => {
    let isMounted = true;
    if (safeUser?._id || safeUser?.id) {
      getUserMaterials(safeUser._id || safeUser.id)
        .then((data) => {
          if (isMounted) setUploadCount(data.length);
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [safeUser]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-[280px] max-w-[calc(100vw-1rem)] overflow-y-auto border-r border-slate-200 bg-white px-4 py-5 shadow-[0_18px_48px_rgba(15,23,42,0.18)] transition-all duration-300 sm:w-[300px] sm:px-5 lg:sticky lg:top-0 lg:z-10 lg:h-[calc(100vh-97px)] lg:max-w-none lg:translate-x-0 lg:py-6 lg:shadow-none ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } ${
        isExpanded ? "lg:w-[280px] xl:w-[300px]" : "lg:w-[104px] lg:px-4"
      }`}
    >
      <div
        className={`mb-8 flex ${
          isExpanded
            ? "items-start justify-between gap-4"
            : "lg:flex-col lg:items-center lg:gap-4"
        }`}
      >
        <Link
          to="/profile"
          onClick={onClose}
          className={`flex min-w-0 items-center ${
            isExpanded ? "gap-4" : "justify-center lg:w-full"
          }`}
        >
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[var(--theme-blue)] text-[1.25rem] font-medium text-white sm:h-[56px] sm:w-[56px] sm:text-[1.35rem]">
            {userInitial}
          </div>

          {isExpanded && (
            <div className="min-w-0">
              <h2 className="mb-1 truncate text-[1.15rem] font-medium tracking-tight text-slate-950">
                {safeUser.name}
              </h2>
              <p className="text-[0.95rem] font-normal text-slate-500">
                {formatRole(safeUser.role)}
              </p>
            </div>
          )}
        </Link>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            type="button"
            onClick={() => setIsCollapsed((open) => !open)}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 shadow-[0_2px_8px_rgba(15,23,42,0.08)] lg:flex"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
            ) : (
              <PanelLeft className="h-5 w-5" strokeWidth={1.8} />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 shadow-[0_2px_8px_rgba(15,23,42,0.08)] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-[1.45rem] font-medium text-slate-950">
                {uploadCount || 0}
              </p>
              <p className="text-[0.95rem] font-normal text-slate-500">
                Uploads
              </p>
            </div>

            <div>
              <p className="text-[1.45rem] font-medium text-slate-950">
                {safeUser.upvotes || 0}
              </p>
              <p className="text-[0.95rem] font-normal text-slate-500">
                Upvotes
              </p>
            </div>
          </div>

          <Link
            to="/uploads/new"
            onClick={onClose}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--theme-blue)] px-5 py-3 text-[1.05rem] font-medium text-white"
          >
            <span className="text-[1.35rem] leading-none">+</span>
            New
          </Link>
        </>
      )}

      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={`mt-3 flex items-center rounded-lg py-3 text-[1.02rem] font-normal ${
                isActive ? "bg-blue-400 text-white" : "bg-slate-50 text-slate-700"
              } ${isExpanded ? "justify-start gap-3 px-4" : "justify-center px-0"}`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
              {isExpanded && item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
