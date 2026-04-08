import React, { useState } from "react";
import { Bell, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";

const demoUser = {
  name: "tranvannguyen24012003",
};

const Navbar = ({ user = demoUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userInitial = user.name.charAt(0).toUpperCase();

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="flex w-full items-center justify-between px-4 py-5">
        <div className="flex items-center gap-5">
          <Link to="/" className="flex items-center gap-4">
            <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden">
              <img
                src="/IU_icon.png"
                alt="IU logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-[2rem] font-medium tracking-tight text-slate-950">
                Learning Hub
              </h1>
            </div>
          </Link>

          <div className="flex w-[360px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[var(--theme-blue)]">
            <Search className="h-5 w-5" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full bg-transparent text-[1rem] outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[1rem] font-normal "
          >
            <Filter className="h-5 w-5" strokeWidth={1.8} />
            Filter
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--theme-blue)]"
          >
            <Bell className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-2xl px-2 py-2 text-slate-950"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--theme-blue)] text-[1rem] font-medium text-white">
                {userInitial}
              </span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-[180px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-[1rem] font-normal text-slate-700"
                >
                  Profile
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
