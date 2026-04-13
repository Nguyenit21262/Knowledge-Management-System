import { Route, Routes } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout.jsx";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminKnowledgeBase from "../pages/admin/AdminKnowledgeBase";
import AdminPlaceholder from "../pages/admin/AdminPlaceholder";
import AdminSearch from "../pages/admin/AdminSearch";
import AdminStudents from "../pages/admin/AdminStudents";
import Bookmarks from "../pages/Bookmarks";
import DocumentDetail from "../pages/DocumentDetail";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import Search from "../pages/Search";
import UploadNew from "../pages/UploadNew";
import Uploads from "../pages/Uploads";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/documents/:documentId" element={<DocumentDetail />} />
        <Route path="/search" element={<Search />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/uploads" element={<Uploads />} />
          <Route path="/uploads/new" element={<UploadNew />} />
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="knowledge-base" element={<AdminKnowledgeBase />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="search" element={<AdminSearch />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="settings" element={<AdminPlaceholder title="Settings" />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
