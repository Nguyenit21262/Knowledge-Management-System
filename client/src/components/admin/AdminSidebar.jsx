import React, { useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  FolderOpen,
  Home,
  LayoutDashboard,
  PanelLeft,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";

const adminSections = [
  {
    title: "Main",
    items: [
      {
        label: "Home",
        to: "/",
        icon: Home,
      },
      {
        label: "Dashboard",
        to: "/admin",
        icon: LayoutDashboard,
        end: true,
      },
      {
        label: "Knowledge Base",
        to: "/admin/knowledge-base",
        icon: BookOpen,
      },
      {
        label: "Categories",
        to: "/admin/categories",
        icon: FolderOpen,
      },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        label: "Students",
        to: "/admin/students",
        icon: Users,
      },
      {
        label: "Settings",
        to: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAppContext();
  const isExpanded = !isCollapsed;
  const safeUser = user || { name: "Teacher", email: "teacher@school.edu" };
  const userInitial = safeUser.name.charAt(0).toUpperCase();

  return (
    <aside
      id="admin-sidebar"
      className={`fixed inset-y-0 left-0 z-40 flex w-[280px] max-w-[calc(100vw-1rem)] flex-col justify-between overflow-y-auto bg-[#0f172a] px-5 py-5 text-white shadow-[0_18px_48px_rgba(15,23,42,0.35)] transition-all duration-300 sm:w-[320px] sm:px-6 sm:py-6 lg:static lg:min-h-screen lg:shrink-0 lg:translate-x-0 lg:py-6 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${
        isExpanded ? "lg:w-[320px] lg:px-7" : "lg:w-[108px] lg:px-4"
      }`}
    >
      <div>
        <div
          className={`mb-8 flex ${
            isExpanded
              ? "items-start justify-between gap-4 lg:mb-12"
              : "lg:flex-col lg:items-center lg:gap-4"
          }`}
        >
          <Link
            to="/admin"
            onClick={onClose}
            className={`flex items-center ${
              isExpanded ? "gap-3 sm:gap-4" : "justify-center lg:w-full"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden sm:h-14 sm:w-14">
              <img
                src="/IU_icon.png"
                alt="IU logo"
                className="h-full w-full object-contain"
              />
            </div>

            {isExpanded && (
              <div>
                <h1 className="text-[1.6rem] font-medium tracking-tight text-white sm:text-[1.9rem]">
                  IU
                </h1>
                <p className="text-[0.98rem] font-normal text-slate-300 sm:text-[1.05rem]">
                  Knowledge Hub
                </p>
              </div>
            )}
          </Link>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <button
              type="button"
              onClick={() => setIsCollapsed((currentState) => !currentState)}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:flex"
              aria-label={isExpanded ? "Collapse admin sidebar" : "Expand admin sidebar"}
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
              className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white lg:hidden"
              aria-label="Close admin menu"
            >
              <X className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="space-y-8 lg:space-y-10">
          {adminSections.map((section) => (
            <section key={section.title}>
              {isExpanded && (
                <p className="mb-4 text-[0.95rem] font-medium uppercase tracking-[0.08em] text-slate-300 sm:text-[1rem]">
                  {section.title}
                </p>
              )}

              <nav className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      end={item.end}
                      onClick={onClose}
                      title={!isExpanded ? item.label : undefined}
                      className={({ isActive }) =>
                        `flex items-center rounded-md py-3 text-[1rem] font-normal transition-colors sm:text-[1.05rem] lg:text-[1.1rem] ${
                          isActive
                            ? "bg-[#1e293b] text-white"
                            : "text-slate-200 hover:bg-white/5 hover:text-white"
                        } ${
                          isExpanded
                            ? "justify-start gap-3 px-4"
                            : "justify-center px-0"
                        }`
                      }
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                      {isExpanded && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </nav>
            </section>
          ))}
        </div>
      </div>

      <div
        className={`flex border-t border-white/10 pt-6 ${
          isExpanded
            ? "items-center gap-4"
            : "justify-center"
        }`}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#1e293b] text-[1.05rem] font-medium text-white sm:h-12 sm:w-12 sm:text-[1.15rem]">
          {userInitial}
        </div>

        {isExpanded && (
          <div className="min-w-0">
            <p className="truncate text-[1rem] font-medium text-white sm:text-[1.05rem]">
              {safeUser.name}
            </p>
            <p className="truncate text-[0.88rem] font-normal text-slate-300 sm:text-[0.95rem]">
              {safeUser.email}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
