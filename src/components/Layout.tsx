import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/Button";
import {
  HomeIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "@/components/ThemeToggle";
import { LoadingPage } from "@/components/LoadingSpinner"; // your spinner component

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { user, signOut, userProfile } = useAuth();

  // Loading state for route change
  const [loading, setLoading] = useState(false);

  // Redirect if no user and not already on /auth page
  useEffect(() => {
    if (!user && router.pathname !== "/auth") {
      router.push("/auth");
    }
  }, [user, router]);

  // Listen to router events to show loading spinner
  useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        setLoading(true);
      }
    };
    const handleCompleteOrError = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleCompleteOrError);
    router.events.on("routeChangeError", handleCompleteOrError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleCompleteOrError);
      router.events.off("routeChangeError", handleCompleteOrError);
    };
  }, [router]);

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Auth", href: "/auth", icon: BoltIcon }, // This is for the auth page
    { name: "Calendar", href: "/calendar", icon: CalendarDaysIcon },
    { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
    { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
    { name: "Plans", href: "/plans", icon: UserCircleIcon },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Show loading spinner overlay first, before anything else
  if (loading) {
    return <LoadingPage message="Loading page..." />;
  }

  // If user not authenticated and redirect in progress, don't render anything
  if (!user) {
    return null;
  }

  // Don't apply layout on /auth and / pages
  if (router.pathname === "/auth" || router.pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Mobile navigation */}
      <div className="lg:hidden">
        <div
          className="fixed bottom-0 left-0 right-0 border-t px-4 py-2 z-50"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex justify-around">
            {navigation.slice(0, 4).map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                        : "text-[var(--color-text)] opacity-70"
                    }`}
                  >
                    <item.icon className="h-6 w-6 mx-auto" />
                    <span className="text-xs mt-1 block">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div
          className="flex flex-col flex-grow border-r overflow-y-auto"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          {/* Logo */}
          <div
            className="flex items-center flex-shrink-0 px-6 py-6 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center mr-3"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-background)",
              }}
            >
              <span className="text-xl select-none">📔</span>
            </div>
            <span className="text-xl font-bold select-none">{`SoulScript`}</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[var(--color-primary)] text-[var(--color-background)]"
                        : "text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
                    }`}
                  >
                    <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div
            className="flex-shrink-0 border-t p-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center">
              <UserCircleIcon className="h-10 w-10 text-[var(--color-text)] opacity-60" />
              <div className="ml-3 flex-1 overflow-hidden">
                <p
                  className="text-sm font-medium truncate"
                  title={userProfile?.displayName || ""}
                >
                  {userProfile?.displayName}
                </p>
                <p
                  className="text-xs truncate opacity-70"
                  title={user?.email || ""}
                >
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={handleSignOut}
              className="w-full mt-3 justify-start text-left"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Sign Out
            </Button>

            {/* Theme Toggle */}
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="pb-20 lg:pb-0">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
