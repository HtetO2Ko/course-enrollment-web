import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { Menu, Moon, Sun, X } from "lucide-react";

import LogoImg from "/favicon.png";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  { to: "/", label: "home" },
  { to: "/contact", label: "contact" },
];

export default function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const isEnglish = i18n.resolvedLanguage === "en";
  const isDark = theme === "dark";

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const toggleLanguage = () => {
    const nextLang = isEnglish ? "my" : "en";
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <div className="min-h-dvh bg-surface">
      {!isAuthPage && (
        <header className="fixed left-0 top-0 z-50 flex w-full justify-center bg-surface font-sans shadow-md transition-colors duration-200">
          <div className="flex h-16 w-[95%] items-center justify-between sm:w-[90%] md:w-[85%]">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img className="mr-2 h-10 w-10" src={LogoImg} alt="Logo" />
              <h1 className="text-xl font-bold text-maincolor sm:max-md:sr-only">
                Course Enrollment
              </h1>
            </Link>

            {/* Navigation */}
            <nav
              className={
                menuOpen
                  ? "absolute inset-x-0 top-full bg-surface shadow-md sm:static sm:bg-transparent sm:shadow-none"
                  : "hidden sm:block"
              }
            >
              <ul
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:p-0"
                role="list"
              >
                {NAV_ITEMS.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === "/"}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex min-h-12 items-center rounded-xl px-3.5 text-base no-underline transition-colors sm:min-h-10 sm:px-3 sm:text-md ${
                          isActive
                            ? "bg-button-color/10 font-semibold text-selected-color sm:bg-transparent sm:font-medium"
                            : "font-medium text-unselected-color hover:bg-maincolor/5 hover:text-maincolor sm:font-normal"
                        }`
                      }
                    >
                      {t(label)}
                    </NavLink>
                  </li>
                ))}

                {/* Mobile authentication */}
                <li
                  aria-hidden="true"
                  className="my-1.5 border-t border-border-color sm:hidden"
                />

                <li className="sm:hidden">
                  {isAuthenticated ? (
                    <div className="flex min-h-12 items-center justify-between gap-3">
                      <NavLink
                        to="/account"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          `truncate font-medium transition-colors ${
                            isActive
                              ? "text-selected-color"
                              : "text-maincolor hover:text-selected-color"
                          }`
                        }
                      >
                        {user?.fullname}
                      </NavLink>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-lg bg-button-color px-4 py-2.5 text-sm font-semibold text-button-txt transition-opacity hover:opacity-90"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block min-h-11 w-full rounded-xl bg-button-color px-4 py-3 text-center text-base font-semibold text-button-txt transition-opacity hover:opacity-90"
                    >
                      {t("login")}
                    </Link>
                  )}
                </li>
              </ul>
            </nav>

            {/* Header Actions */}
            <div className="flex shrink-0 items-center">
              {/* Theme */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="mr-2 cursor-pointer rounded-xl p-2 text-maincolor transition-colors hover:bg-maincolor/5 sm:mr-3"
              >
                {isDark ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )}
              </button>

              {/* Language */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="mr-3 h-10 cursor-pointer rounded-lg border border-solid border-secondary-button-color px-3 text-secondary-button-txt hover:bg-secondary-button-color/5"
              >
                {isEnglish ? "My" : "En"}
              </button>

              {/* Desktop authentication */}
              {isAuthenticated ? (
                <div className="hidden items-center gap-3 sm:flex">
                  <NavLink
                    to="/account"
                    className={({ isActive }) =>
                      `max-w-36 truncate font-medium transition-colors ${
                        isActive
                          ? "text-selected-color"
                          : "text-maincolor hover:text-selected-color"
                      }`
                    }
                  >
                    {user?.fullname}
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="h-10 cursor-pointer rounded-lg border border-card-border px-4 text-sm font-medium text-unselected-color transition-colors hover:bg-maincolor/5"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden h-10 items-center rounded-lg bg-button-color px-4 text-base font-medium text-button-txt transition-opacity hover:opacity-90 sm:flex"
                >
                  {t("login")}
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="cursor-pointer rounded-lg p-2 text-maincolor transition-colors hover:bg-maincolor/5 sm:hidden"
              >
                {menuOpen ? (
                  <X className="size-6" />
                ) : (
                  <Menu className="size-6" />
                )}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Page Content */}
      <main
        className={`mx-auto w-[95%] sm:w-[90%] md:w-[85%] ${
          isAuthPage ? "" : "pt-16"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
