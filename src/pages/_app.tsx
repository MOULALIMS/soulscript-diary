import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { DiaryProvider } from "@/contexts/DiaryContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import "@/styles/globals.css";
import toast from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  /*
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");

  const ACCESS_CODE = process.env.NEXT_PUBLIC_ACCESS_CODE;

  useEffect(() => {
    const stored = localStorage.getItem("soulscript-access");
    if (stored === ACCESS_CODE) {
      toast.success("Access granted! Welcome to the Smart Diary Platform.");
      setUnlocked(true);
    }
  }, [ACCESS_CODE]);

  const handleUnlock = () => {
    if (code === ACCESS_CODE) {
      localStorage.setItem("soulscript-access", code);
      setUnlocked(true);
    } else {
      toast.error("Incorrect access code. Please try again.");
      setCode("");
    }
  };

  if (!unlocked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f9fafb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          color: "#111827",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* 🔄 Subtle Top Animation }
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #d1d5db",
            borderTop: "4px solid #3b82f6", // blue-500
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "1.5rem",
          }}
        />

        {/* 🧠 Title }
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Enter Access Code
        </h1>
        <p
          style={{
            color: "#6b7280", // gray-500
            fontSize: "0.95rem",
            marginBottom: "1.5rem",
          }}
        >
          This project is private. Please enter your code to continue.
        </p>

        {/* 🔐 Input Field }
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Secret access code"
          style={{
            padding: "0.75rem",
            width: "100%",
            maxWidth: "320px",
            backgroundColor: "#fff",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            color: "#111827",
            fontSize: "1rem",
            marginBottom: "1rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        />

        {/* 🚀 Unlock Button }
        <button
          onClick={handleUnlock}
          style={{
            padding: "0.65rem 1.25rem",
            fontSize: "1rem",
            borderRadius: "6px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={
            (e) => (e.currentTarget.style.backgroundColor = "#2563eb") // darker blue
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#3b82f6")
          }
        >
          Unlock
        </button>

        {/* 🔧 Inline Animation }
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }
  */

  return (
    <ThemeProvider>
      <AuthProvider>
        <DiaryProvider>
          <Header />
          <Component {...pageProps} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: { style: { background: "#10b981" } },
              error: { style: { background: "#ef4444" } },
            }}
          />
        </DiaryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
