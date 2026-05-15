import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useApp } from "../../store/AppContext";
import ThemeToggle from "../common/ThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const { t, isDark } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: t("nav.home"), exact: true },
    { to: "/games", label: t("nav.games") },
    { to: "/favorites", label: t("nav.favorites") },
    { to: "/generator", label: t("nav.generator") },
    { to: "/custom", label: t("nav.custom") },
    { to: "/settings", label: t("nav.settings") },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isDark
            ? "bg-slate-950/80 border-b border-white/5 backdrop-blur-xl"
            : "bg-white/80 border-b border-slate-200 backdrop-blur-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🎲</span>
              <span
                className={`font-black text-xl tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Drink
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500">
                  Quest
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? isDark
                          ? "bg-violet-600/20 text-violet-400"
                          : "bg-violet-50 text-violet-700"
                        : isDark
                          ? "text-slate-400 hover:text-white hover:bg-white/5"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(true)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  isDark
                    ? "text-slate-400 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
                aria-label={t("nav.menu")}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
}
