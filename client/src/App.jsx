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
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

  return (
    <>
      <Toaster />

      {!isAdminRoute ? (
        <>
          <Navbar />
          <div className="flex gap-6 px-0 pb-6">
            <Sidebar />
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
