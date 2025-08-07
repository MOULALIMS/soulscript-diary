import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/Button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Dialog } from "@/components/Dialog"; // Your dialog/modal component
import {
  ShieldCheckIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  ChartBarIcon,
  LockClosedIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const features = [
  {
    icon: <LockClosedIcon className="h-8 w-8" aria-hidden="true" />,
    title: "100% Private & Secure",
    description:
      "End-to-end encryption ensures your thoughts stay completely private.",
    colorVar: "--color-green",
  },
  {
    icon: <SparklesIcon className="h-8 w-8" aria-hidden="true" />,
    title: "AI-Powered Insights",
    description:
      "Get personalized insights about your emotional patterns and growth.",
    colorVar: "--color-yellow",
  },
  {
    icon: <ChartBarIcon className="h-8 w-8" aria-hidden="true" />,
    title: "Mood Tracking",
    description:
      "Track your moods and see beautiful visualizations of your emotional journey.",
    colorVar: "--color-blue",
  },
  {
    icon: <DevicePhoneMobileIcon className="h-8 w-8" aria-hidden="true" />,
    title: "Cross-Platform Sync",
    description:
      "Access your diary anywhere with secure cloud synchronization.",
    colorVar: "--color-purple",
  },
  {
    icon: <CalendarDaysIcon className="h-8 w-8" aria-hidden="true" />,
    title: "Calendar View",
    description:
      "Navigate through your memories with our intuitive calendar interface.",
    colorVar: "--color-indigo",
  },
  {
    icon: <ShieldCheckIcon className="h-8 w-8" aria-hidden="true" />,
    title: "Daily Reminders",
    description:
      "Gentle notifications to help you maintain consistent journaling habits.",
    colorVar: "--color-red",
  },
];

const IndexPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // State to control Premium Upgrade Dialog visibility
  const [isPremiumDialogOpen, setPremiumDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "var(--color-background)",
          color: "var(--color-text)",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]"
      style={{
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
            Your Personal
            <span
              className="bg-clip-text text-transparent font-extrabold ml-2"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--color-primary), var(--color-secondary))",
              }}
            >
              Emotional Space
            </span>
          </h1>
          <p className="text-xl mb-8 leading-relaxed text-[var(--color-text)]/[0.7]">
            A smart, private diary platform where you can write daily entries,
            track moods, and get AI-powered insights—all while keeping your
            thoughts completely secure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/auth" passHref>
              <Button size="large" className="w-full sm:w-auto px-8">
                Start Journaling for Free
              </Button>
            </Link>
            <Button
              variant="outline"
              size="large"
              className="w-full sm:w-auto px-8"
              onClick={() => alert("Demo coming soon!")}
            >
              Watch Demo
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-8 text-sm opacity-70 text-[var(--color-text)]">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon
                className="h-5 w-5"
                style={{ color: "var(--color-green)" }}
                aria-hidden="true"
              />
              <span>100% Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon
                className="h-5 w-5"
                style={{ color: "var(--color-yellow)" }}
                aria-hidden="true"
              />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <DevicePhoneMobileIcon
                className="h-5 w-5"
                style={{ color: "var(--color-blue)" }}
                aria-hidden="true"
              />
              <span>Cross-Platform</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Mockup */}
        <div className="mt-16 relative max-w-4xl mx-auto">
          <div
            className="rounded-2xl shadow-2xl border overflow-hidden"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div
              className="h-12 flex items-center px-6"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-white text-sm font-medium select-none">
                  SoulScript - Your Digital Diary
                </span>
              </div>
            </div>
            <div
              className="p-8 h-96 flex items-center justify-center"
              style={{ backgroundColor: "var(--color-background)" }}
            >
              <div className="text-center">
                <div
                  className="text-6xl mb-4"
                  style={{ color: "var(--color-text)" }}
                  aria-hidden="true"
                >
                  📝
                </div>
                <h3
                  className="text-2xl font-semibold mb-2"
                  style={{ color: "var(--color-text)" }}
                >
                  Beautiful Writing Experience
                </h3>
                <p className="opacity-70 text-[var(--color-text)]">
                  Clean, distraction-free interface for your thoughts
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--color-text)]">
            Everything You Need for Digital Journaling
          </h2>
          <p className="text-xl max-w-2xl mx-auto opacity-70 text-[var(--color-text)]">
            Powerful features designed to make journaling enjoyable, insightful,
            and secure.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon, title, description, colorVar }, index) => (
            <div
              key={index}
              className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-background)] p-6 shadow-md hover:shadow-lg transition-shadow"
              style={{ color: "var(--color-text)" }}
            >
              <div
                className="mb-4 flex items-center justify-center rounded-full p-3"
                style={{
                  backgroundColor: `var(${colorVar})33`, // 20% opacity hex suffix
                  color: `var(${colorVar})`,
                }}
              >
                {React.cloneElement(icon, { "aria-hidden": true })}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm opacity-80">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--color-text)]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl opacity-70 text-[var(--color-text)]">
            Start free, upgrade when you need more features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div
            className="rounded-2xl p-8 border border-[var(--color-surface)] bg-[var(--color-background)] text-[var(--color-text)] shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
            style={{ minHeight: "500px" }}
          >
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-4">₹0</div>
                <p className="opacity-70">Perfect for getting started</p>
              </div>

              <ul className="space-y-4 opacity-70">
                {[
                  "Unlimited entries",
                  "Mood tracking",
                  "Calendar view",
                  "Basic themes",
                  "Local storage",
                ].map((featureText, idx) => (
                  <li key={idx} className="flex items-center">
                    <ShieldCheckIcon
                      className="h-5 w-5 text-green-500 mr-3"
                      aria-hidden="true"
                    />
                    <span>{featureText}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/auth" passHref>
              <Button variant="outline" size="large" className="w-full mt-8">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Premium Plan */}
          <div
            className="rounded-2xl p-8 relative text-white shadow-lg flex flex-col justify-between transition-transform duration-300 transform hover:scale-[1.03]"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              minHeight: "500px",
            }}
          >
            <div className="absolute top-4 right-4 bg-yellow-400 text-neutral-900 px-4 py-1 rounded-full text-sm font-semibold select-none shadow-md z-10">
              Popular
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-2">₹79</div>
              <p className="opacity-90 mb-8">per month</p>

              <ul className="space-y-4">
                {[
                  "Everything in Free",
                  "AI mood insights",
                  "Cloud sync & backup",
                  "Advanced themes",
                  "Export to PDF",
                  "Priority support",
                ].map((featureText, idx) => (
                  <li key={idx} className="flex items-center">
                    <ShieldCheckIcon
                      className="h-5 w-5 text-white mr-3"
                      aria-hidden="true"
                    />
                    <span>{featureText}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Button triggers the premium dialog modal */}
            <button
              type="button"
              className="
                w-full px-8 py-3 rounded-lg
                bg-[var(--color-background)] text-[var(--color-primary)]
                font-semibold border border-[var(--color-primary)]
                shadow-md
                transition-transform duration-300 ease-in-out
                hover:bg-[var(--color-surface)]
                hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2
              "
              onClick={() => setPremiumDialogOpen(true)}
            >
              Start Premium Trial
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-background)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start Your Journaling Journey Today
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their mental well-being
            through consistent journaling.
          </p>
          <Link href="/auth" passHref>
            <Button
              size="large"
              className="px-8"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-primary)",
                border: "1.5px solid var(--color-primary)",
              }}
            >
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12"
        style={{
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div
              className="rounded-lg p-2 select-none flex items-center justify-center"
              style={{ backgroundColor: "var(--color-primary)" }}
              aria-hidden="true"
            >
              <span>📔</span>
            </div>
            <span className="font-bold">SoulScript</span>
          </div>
          <p style={{ opacity: 0.7 }}>
            Your personal emotional space powered by privacy, design, and AI.
          </p>
          <p style={{ opacity: 0.7 }}>
            &copy; 2025 SoulScript. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Premium Upgrade Dialog */}
      <Dialog
        isOpen={isPremiumDialogOpen}
        onClose={() => setPremiumDialogOpen(false)}
        title="Premium Upgrade – Coming Soon!"
      >
        <div className="text-center p-4">
          <p className="mb-6 text-lg">
            🚧 The premium upgrade is currently under development.
          </p>
          <p className="mb-6 opacity-80">
            Thank you for your interest! Please check back soon&mdash;We’re
            working hard to bring you premium features.
          </p>
          <button
            className="px-5 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-surface)] font-semibold hover:bg-[var(--color-secondary)] transition"
            onClick={() => setPremiumDialogOpen(false)}
          >
            Close
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default IndexPage;
