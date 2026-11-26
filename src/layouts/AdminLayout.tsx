import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  Sun,
  Users,
  X,
} from "lucide-react";
import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const ADMIN_NAV_ITEMS = [
  {
    title: "Courses",
    path: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Batches",
    path: "/admin/batches",
    icon: CalendarDays,
  },
  {
    title: "Enroll Students",
    path: "/admin/enrollments",
    icon: Users,
  },
];

export default function AdminLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isDark = theme === "dark";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const handleLogout = async () => {
    setIsMobileOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-dvh flex flex-col md:flex-row bg-admin-surface text-maincolor overflow-hidden transition-colors duration-200">
      {/* Mobile Header (Visible < 768px) */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 bg-surface border-b border-card-border shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src="/favicon.png"
            alt="Course Enrollment Logo"
            className="h-7 w-7 rounded-md object-contain shrink-0"
          />
          <span className="font-semibold text-base tracking-tight truncate">
            Course Enrollment
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Link
            to="/"
            title="User Site"
            aria-label="Go to User Site"
            className="p-2 rounded-lg text-maincolor hover:bg-maincolor/5 transition-colors"
          >
            <ArrowUpRight className="w-5 h-5" />
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-maincolor hover:bg-maincolor/5 transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg text-maincolor hover:bg-maincolor/5 transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-maincolor/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-surface border-r border-card-border transition-all duration-300 ease-in-out
          md:static md:translate-x-0
          ${isMobileOpen ? "translate-x-0 w-63" : "-translate-x-full"}
          md:w-20
          ${isCollapsed ? "lg:w-20" : "lg:w-63"}
        `}
      >
        {/* Sidebar Header */}
        <div
          className={`h-16 flex items-center border-b border-card-border shrink-0 ${
            isCollapsed
              ? "justify-center px-2"
              : "justify-between px-4 md:justify-center md:px-2 lg:justify-between lg:px-4"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/favicon.png"
              alt="Course Enrollment Logo"
              className="h-8 w-8 rounded-md object-contain shrink-0"
            />
            <span
              className={`font-bold text-base whitespace-nowrap overflow-hidden transition-all duration-200
                inline md:hidden
                ${isCollapsed ? "lg:hidden" : "lg:inline"}
              `}
            >
              Course Enrollment
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg border border-card-border text-maincolor hover:bg-maincolor/5 transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-maincolor hover:bg-maincolor/5 cursor-pointer shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                title={item.title}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors
                  md:justify-center
                  ${isCollapsed ? "lg:justify-center" : "lg:justify-start"}
                  ${
                    isActive
                      ? "bg-button-color text-button-txt"
                      : "text-unselected-color hover:bg-maincolor/5 hover:text-maincolor"
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span
                  className={`whitespace-nowrap overflow-hidden
                    inline md:hidden
                    ${isCollapsed ? "lg:hidden" : "lg:inline"}
                  `}
                >
                  {item.title}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions: User Site, Theme Switch & Logout */}
        <div className="p-3 border-t border-card-border space-y-1.5 shrink-0">
          <Link
            to="/"
            onClick={() => setIsMobileOpen(false)}
            title="User Site"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-unselected-color hover:bg-maincolor/5 hover:text-maincolor transition-colors
              md:justify-center
              ${isCollapsed ? "lg:justify-center" : "lg:justify-start"}
            `}
          >
            <ArrowUpRight className="w-5 h-5 shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden
                inline md:hidden
                ${isCollapsed ? "lg:hidden" : "lg:inline"}
              `}
            >
              User Site
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-unselected-color hover:bg-maincolor/5 hover:text-maincolor transition-colors cursor-pointer
              md:justify-center
              ${isCollapsed ? "lg:justify-center" : "lg:justify-start"}
            `}
          >
            {isDark ? (
              <Sun className="w-5 h-5 shrink-0" />
            ) : (
              <Moon className="w-5 h-5 shrink-0" />
            )}
            <span
              className={`whitespace-nowrap overflow-hidden
                inline md:hidden
                ${isCollapsed ? "lg:hidden" : "lg:inline"}
              `}
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-unselected-color hover:bg-maincolor/5 hover:text-maincolor transition-colors cursor-pointer
              md:justify-center
              ${isCollapsed ? "lg:justify-center" : "lg:justify-start"}
            `}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden
                inline md:hidden
                ${isCollapsed ? "lg:hidden" : "lg:inline"}
              `}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Page Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
