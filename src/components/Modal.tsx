import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/contexts/ThemeContext"; // Use the custom hook to get theme

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "full";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
}) => {
  // Get the current theme (not strictly required here, but can be used for advanced features)
  const { theme } = useTheme();

  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-lg",
    large: "max-w-2xl",
    full: "max-w-7xl",
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[var(--color-primary)] bg-opacity-2 backdrop-blur-sm" />
        </Transition.Child>

        {/* Centered Modal */}
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
              <Dialog.Panel
                className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all`}
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text)",
                }}
              >
                {/* Title + Close button */}
                {title ? (
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 flex items-center justify-between mb-4"
                  >
                    {title}
                    <button
                      title="Close"
                      onClick={onClose}
                      className="text-[var(--color-text)] opacity-60 hover:opacity-100 transition"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>
                ) : (
                  <div className="flex justify-end mb-4">
                    <button
                      title="Close"
                      onClick={onClose}
                      className="text-[var(--color-text)] opacity-60 hover:opacity-100 transition"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                )}

                {/* Modal Body */}
                <div className="text-sm">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
