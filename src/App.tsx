import { Routes, Route, Navigate } from "react-router";
import Layout from "./layouts/Layout";
import Home from "./pages/home/Home";
import Contact from "./pages/contact/Contact";
import AuthPage from "./pages/auth/AuthPage";
import BatchDetail from "./pages/batches/BatchDetail";
import AccountPage from "./pages/account/AccountPage";
import AdminLayout from "./layouts/AdminLayout";
import BatchesPage from "./pages/admin/BatchesPage";
import CoursesPage from "./pages/admin/CoursesPage";
import EnrollStudentsPage from "./pages/admin/EnrollStudentsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/batches/:batchId" element={<BatchDetail />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="courses" replace />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="batches" element={<BatchesPage />} />
        <Route path="enrollments" element={<EnrollStudentsPage />} />
      </Route>
    </Routes>
  );
}
