import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { signInUser, resetPassword } from "@/utils/auth";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

type AuthMode = "signin" | "forgot";

const AuthPage: React.FC = () => {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (mode !== "forgot") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === "signin") {
        await signInUser(formData.email, formData.password);
        toast.success("Welcome back!");
        router.push("/dashboard");
      } else if (mode === "forgot") {
        await resetPassword(formData.email);
        toast.success("Password reset email sent!");
        setMode("signin");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <div
        className="max-w-md w-full space-y-8"
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          border: "1px solid var(--color-surface)",
          color: "var(--color-text)",
        }}
      >
        {/* Logo & Titles */}
        <div className="text-center">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full select-none"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <span
              className="text-3xl"
              style={{ color: "var(--color-background)" }}
            >
              📔
            </span>
          </div>
          <h2 className="text-3xl font-bold">
            {mode === "signin" && "Welcome back"}
            {mode === "forgot" && "Reset password"}
          </h2>
          <p
            className="mt-2"
            style={{ color: "var(--color-text)", opacity: 0.8 }}
            aria-live="polite"
          >
            {mode === "signin" && "Sign in to your personal diary"}
            {mode === "forgot" && "Enter your email to reset your password"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={errors.email}
              icon={<EnvelopeIcon />}
              placeholder="Enter your email"
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              id="email"
              autoComplete="email"
            />

            {mode !== "forgot" && (
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange("password")}
                error={errors.password}
                icon={<LockClosedIcon />}
                placeholder="Enter your password"
                required
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                id="password"
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            size="large"
            aria-live="polite"
          >
            {mode === "signin" && "Sign In"}
            {mode === "forgot" && "Send Reset Email"}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center space-y-2">
          {mode === "signin" && (
            <button
              onClick={() => setMode("forgot")}
              className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] text-sm font-medium transition-colors"
              type="button"
            >
              Forgot your password?
            </button>
          )}

          {mode === "forgot" && (
            <button
              onClick={() => setMode("signin")}
              className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] text-sm font-medium transition-colors"
              type="button"
            >
              Back to sign in
            </button>
          )}

          <p
            className="text-xs text-center text-muted"
            style={{ opacity: 0.6, userSelect: "none" }}
          >
            Account creation is disabled. Contact admin for access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

/*
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { createUser, signInUser, resetPassword } from "@/utils/auth";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

type AuthMode = "signin" | "signup" | "forgot";

const AuthPage: React.FC = () => {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (mode !== "forgot") {
      // Password validations
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      // Signup-specific validations
      if (mode === "signup") {
        if (!formData.displayName) {
          newErrors.displayName = "Name is required";
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === "signin") {
        await signInUser(formData.email, formData.password);
        toast.success("Welcome back!");
        router.push("/dashboard");
      } else if (mode === "signup") {
        await createUser(
          formData.email,
          formData.password,
          formData.displayName
        );
        toast.success("Account created successfully!");
        router.push("/dashboard");
      } else if (mode === "forgot") {
        await resetPassword(formData.email);
        toast.success("Password reset email sent!");
        setMode("signin");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <div
        className="max-w-md w-full space-y-8"
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          border: "1px solid var(--color-surface)",
          color: "var(--color-text)",
        }}
      >
        {/* Logo & Titles *
        <div className="text-center">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full select-none"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <span
              className="text-3xl"
              style={{ color: "var(--color-background)" }}
            >
              📔
            </span>
          </div>
          <h2 className="text-3xl font-bold">
            {mode === "signin" && "Welcome back"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Reset password"}
          </h2>
          <p
            className="mt-2"
            style={{ color: "var(--color-text)", opacity: 0.8 }}
            aria-live="polite"
          >
            {mode === "signin" && "Sign in to your personal diary"}
            {mode === "signup" && "Start your journaling journey today"}
            {mode === "forgot" && "Enter your email to reset your password"}
          </p>
        </div>

        {/* Form 
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="space-y-4">
            {(mode === "signin" || mode === "signup" || mode === "forgot") && (
              <Input
                label="Email address"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                error={errors.email}
                icon={<EnvelopeIcon />}
                placeholder="Enter your email"
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                id="email"
                autoComplete="email"
              />
            )}

            {mode === "signup" && (
              <Input
                label="Full name"
                type="text"
                value={formData.displayName}
                onChange={handleInputChange("displayName")}
                error={errors.displayName}
                icon={<UserIcon />}
                placeholder="Enter your full name"
                required
                aria-invalid={!!errors.displayName}
                aria-describedby={
                  errors.displayName ? "displayName-error" : undefined
                }
                id="displayName"
              />
            )}

            {mode !== "forgot" && (
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange("password")}
                error={errors.password}
                icon={<LockClosedIcon />}
                placeholder="Enter your password"
                required
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                id="password"
              />
            )}

            {mode === "signup" && (
              <Input
                label="Confirm password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                error={errors.confirmPassword}
                icon={<LockClosedIcon />}
                placeholder="Confirm your password"
                required
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "confirmPassword-error" : undefined
                }
                id="confirmPassword"
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            size="large"
            aria-live="polite"
          >
            {mode === "signin" && "Sign In"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Send Reset Email"}
          </Button>
        </form>

        {/* Form Footers }
        <div className="text-center space-y-2">
          {mode === "signin" && (
            <>
              <button
                onClick={() => setMode("forgot")}
                className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] text-sm font-medium transition-colors"
                type="button"
              >
                Forgot your password?
              </button>
              <div
                className="text-center text-sm"
                style={{
                  color: "var(--color-text)",
                  opacity: 0.7,
                  userSelect: "none",
                }}
              >
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium transition-colors"
                  type="button"
                >
                  Sign up
                </button>
              </div>
            </>
          )}

          {mode === "signup" && (
            <div
              className="text-center text-sm"
              style={{
                color: "var(--color-text)",
                opacity: 0.7,
                userSelect: "none",
              }}
            >
              Already have an account?{" "}
              <button
                onClick={() => setMode("signin")}
                className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium transition-colors"
                type="button"
              >
                Sign in
              </button>
            </div>
          )}

          {mode === "forgot" && (
            <button
              onClick={() => setMode("signin")}
              className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] text-sm font-medium transition-colors"
              type="button"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

*/
