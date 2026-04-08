import React from "react";
import { PanelLeft } from "lucide-react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f7f8fb]">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <header className="border-b border-slate-200 bg-white px-8 py-6">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700"
          >
            <PanelLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </header>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
