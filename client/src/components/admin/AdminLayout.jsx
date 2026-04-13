import React, { useEffect, useState } from "react";
import { LogOut, PanelLeft } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminNotificationsBell from "./AdminNotificationsBell";
import AdminSidebar from "./AdminSidebar";
import { useAppContext } from "../../context/useAppContext";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAppContext();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8fb]">
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 lg:hidden"
              aria-label="Open admin menu"
              aria-expanded={isSidebarOpen}
              aria-controls="admin-sidebar"
            >
              <PanelLeft className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <div className="ml-auto flex items-center gap-3">
              <AdminNotificationsBell />

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 text-[0.95rem] font-medium text-red-600 transition hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.8} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
