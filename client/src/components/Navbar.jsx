import React, { useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { Link } from "react-router-dom";

const demoUser = {
  name: "tranvannguyen24012003",
};

const Navbar = ({ user = demoUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userInitial = user.name.charAt(0).toUpperCase();

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-10 py-6">
        <Link to="/" className="flex items-center gap-4">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl ">
            <BookOpen className="h-7 w-7 text-black" strokeWidth={1.9} />
          </div>

          <div>
            <h1 className="text-[2rem] font-semibold tracking-tight text-slate-950">
              Studocu Pha Ke
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-5">
          <div className="flex w-[360px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-500">
            <Search className="h-5 w-5" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full bg-transparent text-[1rem] outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-2xl  px-4 py-3 text-slate-950"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dfe3ff] text-[1rem] font-medium text-[#4f46ff]">
                {userInitial}
              </span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-[180px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                <button
                  type="button"
                  className="w-full rounded-xl px-4 py-3 text-left text-[1rem] font-normal text-slate-700"
                >
                  Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
