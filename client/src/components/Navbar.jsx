import React, { useEffect, useState } from "react";
import { Bell, PanelLeft, Search, Upload } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const demoUser = {
  name: "tranvannguyen24012003",
};

const Navbar = ({ user = demoUser, onOpenSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userInitial = user.name.charAt(0).toUpperCase();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="relative z-50 w-full border-b border-slate-200 bg-white">
      <div className="flex w-full flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[var(--theme-blue)] lg:hidden"
            aria-label="Open sidebar"
          >
            <PanelLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <Link to="/" className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden sm:h-[60px] sm:w-[60px]">
              <img
                src="/IU_icon.png"
                alt="IU logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[1.6rem] font-medium tracking-tight text-slate-950 sm:text-[2rem]">
                Learning Hub
              </h1>
            </div>
          </Link>
        </div>

        <div className="order-3 w-full md:order-none md:max-w-[440px] md:flex-1 md:min-w-[280px]">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[var(--theme-blue)] sm:px-5">
            <Search className="h-5 w-5 shrink-0" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full bg-transparent text-[1rem] outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <Link
            to="/uploads/new"
            className="inline-flex items-center gap-2 rounded-2xl px-2 py-2 text-[0.98rem] font-normal text-slate-500 sm:text-[1.05rem]"
          >
            <Upload className="h-5 w-5" strokeWidth={1.8} />
            <span className="hidden sm:inline">Upload</span>
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--theme-blue)] sm:h-12 sm:w-12"
          >
            <Bell className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-2xl px-1 py-1 text-slate-950 sm:px-2 sm:py-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--theme-blue)] text-[1rem] font-medium text-white sm:h-11 sm:w-11">
                {userInitial}
              </span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[180px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-[1rem] font-normal text-slate-700"
                >
                  Profile
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-[1rem] font-normal text-slate-700"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
