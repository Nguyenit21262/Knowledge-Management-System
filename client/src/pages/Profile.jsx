import React from "react";
import {
  BookOpen,
  Bookmark,
  CalendarDays,
  FileText,
  Mail,
  MessageSquare,
  Pencil,
  Shield,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const profile = {
  name: "tranvannguyen24012003",
  email: "tranvannguyen24012003@gmail.com",
  role: "Student",
  bio: "No bio added yet.",
  memberSince: "September 20, 2025",
  downloads: 34,
  comments: 23,
  bookmarked: 18,
};

const Profile = () => {
  return (
    <main className="min-h-[calc(100vh-117px)] bg-[#f6f9ff] px-10 py-10">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <section className="rounded-[28px] border border-slate-200 bg-white px-10 py-10 shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-[2rem] font-medium tracking-tight text-slate-950">
              Profile Information
            </h1>

            <button
              type="button"
              className="inline-flex items-center gap-3 text-[1.1rem] font-normal text-[var(--theme-blue)]"
            >
              <Pencil className="h-5 w-5" strokeWidth={1.7} />
              Edit
            </button>
          </div>

          <div className="mb-10 flex items-center gap-9">
            <div className="flex h-[146px] w-[146px] items-center justify-center rounded-full bg-[var(--theme-blue)] text-white">
              <UserRound className="h-16 w-16" strokeWidth={1.7} />
            </div>

            <div>
              <span className="mb-5 inline-flex rounded-full bg-slate-100 px-5 py-2 text-[1rem] font-normal text-[var(--theme-blue)]">
                {profile.role}
              </span>
              <h2 className="text-[2.45rem] font-medium tracking-tight text-slate-950">
                {profile.name}
              </h2>
              <p className="text-[1.15rem] font-normal text-slate-600">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <div className="space-y-10">
              <div>
                <div className="mb-3 flex items-center gap-3 text-slate-700">
                  <UserRound className="h-6 w-6 text-[var(--theme-blue)]" strokeWidth={1.7} />
                  <span className="text-[1rem] font-medium">Full Name</span>
                </div>
                <p className="text-[1.05rem] font-normal text-slate-950">
                  {profile.name}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3 text-slate-700">
                  <Mail className="h-6 w-6 text-[var(--theme-blue)]" strokeWidth={1.7} />
                  <span className="text-[1rem] font-medium">Email Address</span>
                </div>
                <p className="text-[1.05rem] font-normal text-slate-950">
                  {profile.email}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3 text-slate-700">
                  <Shield className="h-6 w-6 text-[var(--theme-blue)]" strokeWidth={1.7} />
                  <span className="text-[1rem] font-medium">Role</span>
                </div>
                <p className="text-[1.05rem] font-normal text-slate-950">
                  {profile.role}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3 text-slate-700">
                  <FileText className="h-6 w-6 text-[var(--theme-blue)]" strokeWidth={1.7} />
                  <span className="text-[1rem] font-medium">Bio</span>
                </div>
                <p className="text-[1.05rem] font-normal text-slate-950">
                  {profile.bio}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3 text-slate-700">
                  <CalendarDays className="h-6 w-6 text-[var(--theme-blue)]" strokeWidth={1.7} />
                  <span className="text-[1rem] font-medium">Member Since</span>
                </div>
                <p className="text-[1.05rem] font-normal text-slate-950">
                  {profile.memberSince}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="rounded-[28px] border border-slate-200 bg-white px-9 py-9 shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
            <h2 className="mb-8 text-[2rem] font-medium tracking-tight text-slate-950">
              Statistics
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-5 rounded-[24px] bg-white px-6 py-7">
                <div className="flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-[var(--theme-blue)] text-white">
                  <BookOpen className="h-7 w-7" strokeWidth={1.7} />
                </div>
                <div>
                  <p className="text-[1rem] font-normal text-slate-600">
                    Materials Downloaded
                  </p>
                  <p className="text-[2rem] font-medium text-slate-950">
                    {profile.downloads}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-[24px] bg-white px-6 py-7">
                <div className="flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-[var(--theme-blue)] text-white">
                  <MessageSquare className="h-7 w-7" strokeWidth={1.7} />
                </div>
                <div>
                  <p className="text-[1rem] font-normal text-slate-600">
                    Comments Posted
                  </p>
                  <p className="text-[2rem] font-medium text-slate-950">
                    {profile.comments}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-[24px] bg-white px-6 py-7">
                <div className="flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-[var(--theme-blue)] text-white">
                  <Bookmark className="h-7 w-7" strokeWidth={1.7} />
                </div>
                <div>
                  <p className="text-[1rem] font-normal text-slate-600">
                    Bookmarked
                  </p>
                  <p className="text-[2rem] font-medium text-slate-950">
                    {profile.bookmarked}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white px-9 py-9 shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
            <h2 className="mb-8 text-[2rem] font-medium tracking-tight text-slate-950">
              Quick Actions
            </h2>

            <Link
              to="/"
              className="inline-flex items-center gap-4 text-[1.1rem] font-normal text-[var(--theme-blue)]"
            >
              <BookOpen className="h-7 w-7" strokeWidth={1.7} />
              View All Materials
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;
