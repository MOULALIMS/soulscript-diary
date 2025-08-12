// src/utils/withAuth.tsx
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import React from "react";

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const ProtectedPage = (props: P) => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
      if (!authLoading && !user) {
        router.replace("/auth");
      }
    }, [authLoading, user, router]);

    if (authLoading || (!user && !authLoading)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-text)]">
          <LoadingSpinner size="large" />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedPage;
}
