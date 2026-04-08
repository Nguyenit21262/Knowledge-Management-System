import React from "react";
import {
  BookOpen,
  FolderOpen,
  LayoutDashboard,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const adminSections = [
  {
    title: "Main",
    items: [
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
      {
        label: "Search",
        to: "/admin/search",
        icon: Search,
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

const AdminSidebar = () => {
  return (
    <aside className="flex min-h-screen w-[320px] shrink-0 flex-col justify-between bg-[#1b2e5c] px-7 py-6 text-white">
      <div>
        <div className="mb-12 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden">
            <img
              src="/IU_icon.png"
              alt="IU logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-[1.9rem] font-medium tracking-tight text-white">
              IU
            </h1>
            <p className="text-[1.05rem] font-normal text-slate-300">
              Knowledge Hub
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {adminSections.map((section) => (
            <section key={section.title}>
              <p className="mb-4 text-[1.05rem] font-medium text-slate-300">
                {section.title}
              </p>

              <nav className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-4 py-3 text-[1.1rem] font-normal transition-colors ${
                          isActive
                            ? "bg-[#37508b] text-white"
                            : "text-slate-200 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </section>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-white/10 pt-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#37508b] text-[1.15rem] font-medium text-white">
          A
        </div>

        <div>
          <p className="text-[1.05rem] font-medium text-white">Admin User</p>
          <p className="text-[0.95rem] font-normal text-slate-300">
            admin@school.edu
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
