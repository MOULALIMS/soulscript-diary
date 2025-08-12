import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog"; // Import your Dialog modal
import withAuth from "@/utils/withAuth";

const PlansPage: React.FC = () => {
  const { userProfile } = useAuth();

  // Dialog open state
  const [isPremiumDialogOpen, setPremiumDialogOpen] = useState(false);

  return (
    <>
      <main
        className="max-w-xl mx-auto py-16 px-4 min-h-screen"
        style={{
          backgroundColor: "var(--color-background)",
          color: "var(--color-text)",
        }}
      >
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: "var(--color-text)" }}
        >
          Your Subscription Plan
        </h1>

        <div
          className="rounded-xl border shadow p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <p className="mb-3" style={{ color: "var(--color-text)" }}>
            <strong>Current Plan:</strong>{" "}
            {userProfile?.plan ? (
              <span
                className="inline-block px-3 py-1 rounded"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                }}
              >
                {userProfile.plan.charAt(0).toUpperCase() +
                  userProfile.plan.slice(1)}
              </span>
            ) : (
              <span className="text-gray-500">Free</span>
            )}
          </p>

          {userProfile?.plan === "premium" ? (
            <div
              className="mt-4 font-medium"
              style={{ color: "var(--color-green-600)", minHeight: "3rem" }}
            >
              You have full access to all features!
            </div>
          ) : (
            <div className="mt-4">
              <p
                className="mb-4"
                style={{ color: "var(--color-text)", opacity: 0.9 }}
              >
                Upgrade to premium to access analytics and all features.
              </p>

              {/* Replace handleUpgrade alert with dialog open */}
              <Button
                className="px-6"
                onClick={() => setPremiumDialogOpen(true)}
                size="large"
              >
                Upgrade to Premium
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Premium Upgrade Dialog */}
      <Dialog
        isOpen={isPremiumDialogOpen}
        onClose={() => setPremiumDialogOpen(false)}
        title="Premium Upgrade – Coming Soon!"
      >
        <div>
          <p
            className="mb-6 text-lg"
            style={{ color: "var(--color-background)" }}
          >
            🚧 The premium upgrade is currently under development.
          </p>
          <p
            className="mb-6 opacity-90"
            style={{ color: "var(--color-background)" }}
          >
            Thank you for your interest! Please check back soon—We’re working
            hard to bring you premium features.
          </p>
          <button
            className="px-5 py-2 rounded-lg bg-[var(--color-background)] text-[var(--color-primary)] font-semibold hover:opacity-80 transition"
            onClick={() => setPremiumDialogOpen(false)}
          >
            Close
          </button>
        </div>
      </Dialog>
    </>
  );
};

export default withAuth(PlansPage);
