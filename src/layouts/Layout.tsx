import { useTranslation } from "react-i18next";
import { Menu, Moon, Sun, X } from "lucide-react";
import LogoImg from "/favicon.png";
import { NavLink, Outlet } from "react-router";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  { to: "/", label: "home" },
  { to: "/contact", label: "contact" },
];

export default function Layout() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isEnglish = i18n.resolvedLanguage === "en";
  const isDark = theme === "dark";

  const toggleLanguage = () => {
    const nextLang = isEnglish ? "my" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky flex justify-center bg-surface w-full shadow-md font-sans transition-colors duration-200">
        <div className="flex justify-between items-center w-[95%] sm:w-[90%] md:[85%] h-16">
          <div className="flex items-center">
            <img className="h-10 w-10 mr-2" src={LogoImg} alt="Logo" />
            <h1 className="text-xl font-bold text-maincolor sm:max-md:sr-only">
              Course Enrollment
            </h1>
          </div>
          <nav
            className={
              menuOpen
                ? "max-sm:absolute max-sm:inset-x-0 max-sm:top-full max-sm:bg-surface max-sm:shadow-md"
                : "max-sm:hidden"
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
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center rounded-xl px-3.5 text-base transition-colors no-underline sm:min-h-10 sm:px-3 sm:text-md ${
                        isActive
                          ? "max-sm:bg-button-color/10 text-selected-color font-semibold sm:font-medium"
                          : "text-unselected-color font-medium sm:font-normal hover:bg-maincolor/5 hover:text-maincolor"
                      }`
                    }
                  >
                    {t(label)}
                  </NavLink>
                </li>
              ))}

              <li
                aria-hidden="true"
                className="my-1.5 border-t border-border-color sm:hidden"
              />
              <li className="sm:hidden">
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="h-11 w-full cursor-pointer rounded-xl bg-button-color px-4 text-base font-semibold text-button-txt transition-opacity hover:opacity-90"
                >
                  {t("login")}
                </button>
              </li>
            </ul>
          </nav>
          <div className="flex items-center">
            <button
              type="button"
              onClick={toggleTheme}
              className="cursor-pointer rounded-xl text-maincolor transition-colors hover:bg-maincolor/5 mr-4"
            >
              {isDark ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </button>
            <button
              className="cursor-pointer border border-solid border-secondary-button-color px-3 h-10 rounded-lg mr-3 text-secondary-button-txt hover:bg-secondary-button-color/5"
              type="button"
              onClick={toggleLanguage}
            >
              {isEnglish ? "My" : "En"}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className=" cursor-pointer hover:bg-maincolor/5 sm:hidden"
            >
              {menuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
            <button className="cursor-pointer hidden px-4 h-10 bg-button-color text-button-txt text-base font-medium rounded-lg hover:opacity-90 sm:block">
              {t("login")}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-[95%] sm:w-[90%] md:[85%]">
        <Outlet />
      </main>
    </div>
  );
}
