import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import {
  LockClosedIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";

const Header: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();
  const router = useRouter();

  // State for dropdown menu open/close
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Redirect logged-in users to /calendar as landing page
  useEffect(() => {
    // Only redirect if on root ("/") and user is logged in
    if (user && router.pathname === "/") {
      router.replace("/calendar");
    }
  }, [user, router]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await signOut();
    router.push("/");
  };

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Determine if user is premium
  const isPremium = userProfile?.plan === "premium";

  return (
    <header className="bg-[var(--color-surface)] shadow-sm border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link href="/" passHref>
          <span
            className="flex items-center text-xl font-extrabold cursor-pointer select-none no-underline"
            style={{
              background:
                "linear-gradient(to right, var(--color-primary), var(--color-secondary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <span className="mr-2 text-2xl select-none">📔</span>
            SoulScript
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-6 text-[var(--color-text)] font-medium flex items-center">
          {/* Home link */}
          <Link href={user ? "/dashboard" : "/"} passHref>
            <span className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">
              Home
            </span>
          </Link>

          {/* Calendar link visible only to logged in users */}
          {user && (
            <Link href="/calendar" passHref>
              <span className="hover:text-[var(--color-primary)] cursor-pointer transition-colors flex items-center space-x-1">
                <CalendarDaysIcon className="h-5 w-5" />
                <span>Calendar</span>
              </span>
            </Link>
          )}

          {/* Plans link for logged in users */}
          {user && (
            <Link href="/plans" passHref>
              <span className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">
                Plans
              </span>
            </Link>
          )}

          {/* Analytics link (unlocked for all logged in users) */}
          {user && (
            <Link href="/analytics" passHref>
              <span className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">
                Analytics
              </span>
            </Link>
          )}

          <ThemeToggle />

          {/* User menu */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex items-center space-x-2 rounded px-3 py-1 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-surface)] transition focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <span className="sr-only">Open user menu</span>
                <span className="text-sm font-medium truncate max-w-xs max-[400px]:max-w-[6rem]">
                  {userProfile?.displayName || user.email?.split("@")[0]}
                </span>
                <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[var(--color-surface)] ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <Link href="/settings">
                    <div
                      className="block px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-[var(--color-surface)]"
                      role="menuitem"
                      tabIndex={-1}
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Cog6ToothIcon className="h-5 w-5" />
                        <span>Settings</span>
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                    role="menuitem"
                    tabIndex={-1}
                  >
                    <div className="flex items-center space-x-2">
                      <LockClosedIcon className="h-5 w-5" />
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" passHref>
              <span className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">
                Login
              </span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
