import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./components/admin/AdminLayout";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminKnowledgeBase from "./pages/admin/AdminKnowledgeBase";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import Bookmarks from "./pages/Bookmarks";
import DocumentDetail from "./pages/DocumentDetail";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import UploadNew from "./pages/UploadNew";
import Uploads from "./pages/Uploads";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isAdminRoute) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = isSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isAdminRoute, isSidebarOpen]);

  return (
    <>
      <Toaster />

      {!isAdminRoute ? (
        <>
          <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
          <div className="relative flex min-h-[calc(100vh-97px)]">
            <div
              className={`fixed inset-0 z-30 bg-slate-950/40 transition-opacity duration-300 lg:hidden ${
                isSidebarOpen
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />

            <Sidebar
              isMobileOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            <div className="min-w-0 flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/documents/:documentId"
                  element={<DocumentDetail />}
                />
                <Route path="/search" element={<Search />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/uploads" element={<Uploads />} />
                <Route path="/uploads/new" element={<UploadNew />} />
              </Routes>
              <Footer />
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="knowledge-base" element={<AdminKnowledgeBase />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route
              path="search"
              element={<AdminPlaceholder title="Search" />}
            />
            <Route
              path="students"
              element={<AdminPlaceholder title="Students" />}
            />
            <Route
              path="settings"
              element={<AdminPlaceholder title="Settings" />}
            />
          </Route>
        </Routes>
      )}
    </>
  );
};

export default App;
