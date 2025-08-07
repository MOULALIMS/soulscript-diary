import React, { Fragment } from "react";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/contexts/ThemeContext";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "full";
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  className = "",
}) => {
  const sizeClasses: Record<string, string> = {
    small: "max-w-md",
    medium: "max-w-lg",
    large: "max-w-2xl",
    full: "max-w-7xl",
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop: primary color at 25% opacity */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-transparent-25 bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel
                className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${className}`}
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-background)", // All text, including children, will be using background color for good contrast
                }}
              >
                {title ? (
                  <HeadlessDialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 flex items-center justify-between mb-4"
                    style={{ color: "var(--color-background)" }}
                  >
                    {title}
                    <button
                      type="button"
                      onClick={onClose}
                      className="opacity-70 hover:opacity-100 transition"
                      aria-label="Close dialog"
                      style={{ color: "var(--color-background)" }}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </HeadlessDialog.Title>
                ) : (
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="opacity-70 hover:opacity-100 transition"
                      aria-label="Close dialog"
                      style={{ color: "var(--color-background)" }}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                )}

                {/* All modal content */}
                <div
                  className="text-sm"
                  style={{ color: "var(--color-background)" }}
                >
                  {children}
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
};
