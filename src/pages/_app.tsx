import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { DiaryProvider } from "@/contexts/DiaryContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header"; // import Header component
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DiaryProvider>
          <Header /> {/* Persistently rendered on all pages */}
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
