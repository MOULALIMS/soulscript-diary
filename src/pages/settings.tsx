import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  UserIcon,
  PaintBrushIcon,
  BellIcon,
  ShieldCheckIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import { getMoodEntries, DiaryEntry } from "@/utils/diary";

const SettingsPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { theme, setTheme, themes } = useTheme();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    toast.success(
      `Switched to ${themes.find((t) => t.id === newTheme)?.name} theme`
    );
  };

  const handleExportData = async () => {
    try {
      // Show toast during process
      toast.loading("Preparing export...");

      // Fetch all diary entries for current user
      const entries: DiaryEntry[] = await getMoodEntries(user!.uid);

      // Create new PDF document
      const doc = new jsPDF();

      // Starting y position for text
      let yPos = 20;

      // Add title
      doc.setFontSize(20);
      doc.text("SoulScript User Data Export", 10, yPos);
      yPos += 10;

      // Add user profile info
      doc.setFontSize(14);
      doc.text(`Display Name: ${userProfile?.displayName || "N/A"}`, 10, yPos);
      yPos += 8;
      doc.text(`Email: ${user?.email || "N/A"}`, 10, yPos);
      yPos += 8;

      // Add settings info
      doc.text(`Selected Theme: ${theme}`, 10, yPos);
      yPos += 8;
      doc.text(
        `Daily Reminders: ${reminderEnabled ? "Enabled" : "Disabled"}`,
        10,
        yPos
      );
      yPos += 8;
      if (reminderEnabled) {
        doc.text(`Reminder Time: ${reminderTime}`, 10, yPos);
        yPos += 12;
      } else {
        yPos += 4;
      }

      // Add diary entries header
      doc.setFontSize(16);
      doc.text("Diary Entries:", 10, yPos);
      yPos += 10;

      doc.setFontSize(12);

      if (entries.length === 0) {
        doc.text("No diary entries found.", 10, yPos);
        yPos += 8;
      } else {
        // Iterate entries and add to PDF with pagination
        for (const entry of entries) {
          // Format date nicely
          const entryDate =
            entry.createdAt.toLocaleDateString() +
            " " +
            entry.createdAt.toLocaleTimeString();

          // Prepare the text for this entry
          const entryText = `Date: ${entryDate}\nMood: ${entry.mood}\nContent: ${entry.content}`;

          // Split text to fit page width
          const splitText = doc.splitTextToSize(entryText, 180); // width margin ~180

          // Check if we need a new page
          if (yPos + splitText.length * 7 > 280) {
            // roughly page bottom margin
            doc.addPage();
            yPos = 20;
          }

          // Add the split text line by line
          doc.text(splitText, 10, yPos);
          yPos += splitText.length * 7 + 6; // line height + some gap
        }
      }

      // Save the PDF file to user's device
      doc.save("SoulScript_User_Data.pdf");

      toast.dismiss(); // remove loading toast
      toast.success("Data export started! Check your downloads.");
      setShowExportModal(false);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.dismiss();
      toast.error("Failed to export data. Please try again.");
    }
  };

  const handleDeleteAccount = () => {
    toast.error("This Feature is not applicable for the users");
    setShowDeleteModal(false);
  };

  if (!userProfile) {
    return <LoadingSpinner />;
  }

  // Only Light and Dark themes are enabled
  const enabledThemes = ["light", "dark"];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-background)",
        borderColor: "var(--color-border)",
        color: "var(--color-text)",
      }}
    >
      {/* Header */}
      <header
        className="shadow-sm border-b"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Settings
          </h1>
          <p
            className="mt-2"
            style={{ color: "var(--color-text)", opacity: 0.7 }}
          >
            Manage your account and preferences
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Section */}
        <section
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2
              className="text-lg font-semibold flex items-center"
              style={{ color: "var(--color-text)" }}
            >
              <UserIcon className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
              Profile
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Display Name"
                value={userProfile.displayName}
                disabled
                className="bg-[var(--color-background)]"
              />
              <Input
                label="Email Address"
                value={user?.email || ""}
                disabled
                className="bg-[var(--color-background)]"
              />
            </div>
            <p
              className="text-sm"
              style={{ color: "var(--color-text)", opacity: 0.6 }}
            >
              Profile editing is currently not available. Contact support to
              make changes.
            </p>
          </div>
        </section>

        {/* Appearance Section */}
        <section
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2
              className="text-lg font-semibold flex items-center"
              style={{ color: "var(--color-text)" }}
            >
              <PaintBrushIcon className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
              Appearance
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((themeOption) => {
              const isEnabled = enabledThemes.includes(themeOption.id);
              const isSelected = theme === themeOption.id;
              return (
                <div
                  key={themeOption.id}
                  className={`
          relative border-2 rounded-lg p-4 transition-all shadow-sm
          ${
            isSelected
              ? "border-[var(--color-primary)] bg-[var(--color-surface)]/10 shadow-md"
              : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:shadow-md"
          }
          ${isEnabled ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}
        `}
                  onClick={() => {
                    if (isEnabled) handleThemeChange(themeOption.id);
                  }}
                  title={
                    isEnabled
                      ? themeOption.description
                      : "Premium theme coming soon!"
                  }
                  aria-disabled={!isEnabled}
                >
                  {/* Theme color preview circles */}
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className="w-6 h-6 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: themeOption.colors.primary }}
                    />
                    <h3
                      className={`font-medium ${
                        isEnabled ? "text-[var(--color-text)]" : "text-gray-500"
                      }`}
                    >
                      {themeOption.name}
                    </h3>
                  </div>
                  <p
                    className={`text-sm ${
                      isEnabled ? "text-[var(--color-text)]" : "text-gray-500"
                    }`}
                  >
                    {themeOption.description}
                  </p>
                  <div className="flex space-x-1 mt-2">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: themeOption.colors.background }}
                    />
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: themeOption.colors.surface }}
                    />
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: themeOption.colors.primary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: themeOption.colors.secondary }}
                    />
                  </div>
                  {!isEnabled && (
                    <LockClosedIcon
                      className="absolute top-2 right-2 h-5 w-5 text-gray-400 pointer-events-none"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Notifications Section */}
        <section
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2
              className="text-lg font-semibold flex items-center"
              style={{ color: "var(--color-text)" }}
            >
              <BellIcon className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
              Notifications
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className="font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  Daily Reminders
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text)", opacity: 0.7 }}
                >
                  Get reminded to write in your diary
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title="Enable Daily Reminders"
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[var(--color-background)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--color-primary)] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>

            {reminderEnabled && (
              <div className="ml-6">
                <Input
                  label="Reminder Time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="max-w-xs bg-[var(--color-background)]"
                />
              </div>
            )}
          </div>
        </section>

        {/* Privacy & Security Section */}
        <section
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2
              className="text-lg font-semibold flex items-center"
              style={{ color: "var(--color-text)" }}
            >
              <ShieldCheckIcon className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
              Privacy & Security
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <h3
                  className="font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  Export Your Data
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text)", opacity: 0.7 }}
                >
                  Download all your diary entries and data
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowExportModal(true)}
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <div
              className="border-t"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-red-600">Delete Account</h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text)", opacity: 0.7 }}
                  >
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(true)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* App Info */}
        <section
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--color-text)" }}
          >
            About SoulScript
          </h2>
          <div
            className="space-y-2 text-sm"
            style={{ color: "var(--color-text)", opacity: 0.7 }}
          >
            <p>Version: 1.0.0</p>
            <p>Built with privacy and security in mind</p>
            <p>Your data is encrypted and never shared</p>
          </div>
        </section>
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Your Data"
      >
        <div className="space-y-4" style={{ color: "var(--color-text)" }}>
          <p>
            We'll create a downloadable file containing all your diary entries,
            moods, and settings. This process may take a few moments.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportData}>Start Export</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4" style={{ color: "var(--color-text)" }}>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">⚠️ Warning</h4>
            <p className="text-red-700 text-sm">
              This action cannot be undone. All your diary entries, settings,
              and data will be permanently deleted.
            </p>
          </div>
          <p>Are you absolutely sure you want to delete your account?</p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Keep Account
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Delete Forever
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
