// import { BookOpen, CalendarDays, Users } from "lucide-react";
// import { NavLink, Navigate, Outlet } from "react-router";

import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

// const ADMIN_NAV_ITEMS = [
//   {
//     title: "Courses",
//     path: "/admin/courses",
//     icon: BookOpen,
//   },
//   {
//     title: "Batches",
//     path: "/admin/batches",
//     icon: CalendarDays,
//   },
//   {
//     title: "Enroll Students",
//     path: "/admin/enrollments",
//     icon: Users,
//   },
// ];

export default function AdminLayout() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="">
    </div>
  );
}
