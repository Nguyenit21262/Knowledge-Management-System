import React, { useEffect, useMemo, useState } from "react";
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
import { useAppContext } from "../context/useAppContext.js";
import { formatRole } from "../utils/formatters.js";
import { getProfileSummary } from "../api/users.js";
import toast from "react-hot-toast";

const formatMemberSince = (dateValue) => {
  if (!dateValue) {
    return "Unknown";
  }

  return new Date(dateValue).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getUserInitial = (name) =>
  String(name || "?").trim().charAt(0).toUpperCase() || "?";

const Profile = () => {
  const { user } = useAppContext();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfileData(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const data = await getProfileSummary();
        setProfileData(data);
      } catch (error) {
        toast.error(error.message || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const profile = useMemo(() => {
    const userInfo = profileData?.user || user;
    const stats = profileData?.stats || {};

    return {
      name: userInfo?.name || "Guest User",
      email: userInfo?.email || "No email available",
      role: formatRole(userInfo?.role),
      memberSince: formatMemberSince(userInfo?.createdAt),
      materialsUploaded: stats.materialsUploaded || 0,
      downloads: stats.totalDownloads || 0,
      comments: stats.commentsPosted || 0,
      bookmarked: stats.bookmarked || userInfo?.bookmarks?.length || 0,
    };
  }, [profileData, user]);

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-97px)] bg-[#f6f9ff] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
        <div className="mx-auto max-w-[1440px] rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
          Loading profile...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-97px)] bg-[#f6f9ff] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-6 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-medium tracking-tight text-slate-950 sm:text-[2rem]">
              Profile Information
            </h1>

            <button
              type="button"
              className="inline-flex items-center gap-3 text-[1rem] font-normal text-[var(--theme-blue)] sm:text-[1.1rem]"
            >
              <Pencil className="h-5 w-5" strokeWidth={1.7} />
              Edit
            </button>
          </div>

          <div className="mb-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-9">
            <div className="flex h-[112px] w-[112px] items-center justify-center rounded-full bg-[var(--theme-blue)] text-[2.4rem] font-semibold text-white sm:h-[146px] sm:w-[146px] sm:text-[3rem]">
              {getUserInitial(profile.name)}
            </div>

            <div className="min-w-0">
              <span className="mb-4 inline-flex rounded-full bg-slate-100 px-4 py-2 text-[0.95rem] font-normal text-[var(--theme-blue)] sm:mb-5 sm:px-5 sm:text-[1rem]">
                {profile.role}
              </span>
              <h2 className="break-all text-[1.9rem] font-medium tracking-tight text-slate-950 sm:text-[2.2rem] lg:text-[2.45rem]">
                {profile.name}
              </h2>
              <p className="break-all text-[1rem] font-normal text-slate-600 sm:text-[1.15rem]">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-10">
              <div>
                <div className="mb-3 flex items-center gap-3 text-slate-700">
                  <UserRound
                    className="h-6 w-6 text-[var(--theme-blue)]"
                    strokeWidth={1.7}
                  />
                  <span className="text-[1rem] font-medium">Full Name</span>
                </div>
                <p className="text-[1.05rem] font-normal text-slate-950">
                  {profile.name}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3 text-slate-700">
                  <Mail
                    className="h-6 w-6 text-[var(--theme-blue)]"
                    strokeWidth={1.7}
                  />
                  <span className="text-[1rem] font-medium">Email Address</span>
                </div>
                <p className="text-[1.05rem] font-normal text-slate-950">
                  {profile.email}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3 text-slate-700">
                  <Shield
                    className="h-6 w-6 text-[var(--theme-blue)]"
                    strokeWidth={1.7}
                  />
                  <span className="text-[1rem] font-medium">Role</span>
                </div>
                <p className="text-[1.05rem] font-normal text-slate-950">
                  {profile.role}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3 text-slate-700">
                  <FileText
                    className="h-6 w-6 text-[var(--theme-blue)]"
                    strokeWidth={1.7}
                  />
                  <span className="text-[1rem] font-medium">Materials Uploaded</span>
                </div>
                <p className="text-[1.05rem] font-normal text-slate-950">
                  {profile.materialsUploaded}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3 text-slate-700">
                  <CalendarDays
                    className="h-6 w-6 text-[var(--theme-blue)]"
                    strokeWidth={1.7}
                  />
                  <span className="text-[1rem] font-medium">Member Since</span>
                </div>
                <p className="text-[1.05rem] font-normal text-slate-950">
                  {profile.memberSince}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-white px-5 py-6 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:px-8 sm:py-8 lg:px-9 lg:py-9">
            <h2 className="mb-8 text-[1.75rem] font-medium tracking-tight text-slate-950 sm:text-[2rem]">
              Statistics
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-[24px] bg-white px-4 py-5 sm:gap-5 sm:px-6 sm:py-7">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-2xl bg-[var(--theme-blue)] text-white sm:h-[54px] sm:w-[54px]">
                  <BookOpen className="h-7 w-7" strokeWidth={1.7} />
                </div>
                <div>
                  <p className="text-[1rem] font-normal text-slate-600">
                    Total Downloads
                  </p>
                  <p className="text-[2rem] font-medium text-slate-950">
                    {profile.downloads}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-[24px] bg-white px-4 py-5 sm:gap-5 sm:px-6 sm:py-7">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-2xl bg-[var(--theme-blue)] text-white sm:h-[54px] sm:w-[54px]">
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

              <div className="flex items-center gap-4 rounded-[24px] bg-white px-4 py-5 sm:gap-5 sm:px-6 sm:py-7">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-2xl bg-[var(--theme-blue)] text-white sm:h-[54px] sm:w-[54px]">
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

          <div className="rounded-[28px] border border-slate-200 bg-white px-5 py-6 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:px-8 sm:py-8 lg:px-9 lg:py-9">
            <h2 className="mb-8 text-[1.75rem] font-medium tracking-tight text-slate-950 sm:text-[2rem]">
              Quick Actions
            </h2>

            <Link
              to="/"
              className="inline-flex items-center gap-4 text-[1rem] font-normal text-[var(--theme-blue)] sm:text-[1.1rem]"
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
