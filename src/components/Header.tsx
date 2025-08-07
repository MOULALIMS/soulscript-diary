import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import {
  LockClosedIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";

const Header: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && router.pathname === "/") {
      router.replace("/calendar");
    }
  }, [user, router]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await signOut();
    router.push("/");
  };

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

  const isPremium = userProfile?.plan === "premium";

  return (
    <header className="bg-[var(--color-surface)] shadow-sm border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
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

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center">
          <ThemeToggle />
          <button
            className="ml-4 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-[var(--color-text)] font-medium items-center">
          <Link href={user ? "/dashboard" : "/"}>
            <span className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">
              Home
            </span>
          </Link>

          {user && (
            <>
              <Link href="/calendar">
                <span className="hover:text-[var(--color-primary)] cursor-pointer transition-colors flex items-center space-x-1">
                  <CalendarDaysIcon className="h-5 w-5" />
                  <span>Calendar</span>
                </span>
              </Link>

              <Link href="/plans">
                <span className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">
                  Plans
                </span>
              </Link>

              <Link href="/analytics">
                <span className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">
                  Analytics
                </span>
              </Link>
            </>
          )}

          <ThemeToggle />

          {/* User Menu */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center space-x-2 rounded px-3 py-1 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-surface)] transition"
              >
                <span className="text-sm font-medium truncate max-w-[7rem]">
                  {userProfile?.displayName || user.email?.split("@")[0]}
                </span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[var(--color-surface)] ring-1 ring-black ring-opacity-5 z-50">
                  <Link href="/settings">
                    <div
                      className="block px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-[var(--color-surface)]"
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
            <Link href="/auth">
              <span className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">
                Login
              </span>
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-[var(--color-text)] font-medium">
          <Link href={user ? "/dashboard" : "/"}>
            <div className="hover:text-[var(--color-primary)]">Home</div>
          </Link>
          {user && (
            <>
              <Link href="/calendar">
                <div className="hover:text-[var(--color-primary)]">
                  Calendar
                </div>
              </Link>
              <Link href="/plans">
                <div className="hover:text-[var(--color-primary)]">Plans</div>
              </Link>
              <Link href="/analytics">
                <div className="hover:text-[var(--color-primary)]">
                  Analytics
                </div>
              </Link>
              <Link href="/settings">
                <div className="hover:text-[var(--color-primary)]">
                  Settings
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <Link href="/auth">
              <div className="hover:text-[var(--color-primary)]">Login</div>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
