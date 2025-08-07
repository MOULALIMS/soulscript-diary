import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = "",
  type = "text",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-1">
      {label && (
        <label
          className="block text-sm font-medium"
          style={{ color: "var(--color-text)" }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            {icon}
          </div>
        )}

        <input
          type={inputType}
          className={`
            block w-full rounded-lg border border-[var(--color-surface)] bg-[var(--color-surface)] px-3 py-2 
            placeholder-neutral-400 shadow-sm text-[var(--color-text)] transition-colors
            focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:outline-none focus:ring-1
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }
            ${icon ? "pl-10" : ""}
            ${isPassword ? "pr-10" : ""}
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm text-[var(--color-text)] opacity-70">
          {helperText}
        </p>
      )}
    </div>
  );
};
