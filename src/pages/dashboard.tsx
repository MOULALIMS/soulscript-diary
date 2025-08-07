// pages/dashboard.tsx
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useDiary } from "@/contexts/DiaryContext";
import { Button } from "@/components/Button";
import { EntryCard } from "@/components/EntryCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MoodSelector, MoodBadge } from "@/components/MoodSelector";
import { Modal } from "@/components/Modal";
import { getMoodAnalytics, getMoodInsights } from "@/utils/diary";
import {
  PlusIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  SparklesIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { Mood } from "@/contexts/DiaryContext";
import toast from "react-hot-toast";

const DashboardPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { entries, loading, addEntry } = useDiary();

  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [newEntryContent, setNewEntryContent] = useState("");
  const [newEntryMood, setNewEntryMood] = useState<Mood | null>(null);
  const [newEntryTags, setNewEntryTags] = useState("");
  const [savingEntry, setSavingEntry] = useState(false);

  const analytics = entries.length > 0 ? getMoodAnalytics(entries) : null;
  const insights = entries.length > 0 ? getMoodInsights(entries) : [];

  const todayEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.createdAt);
    const today = new Date();
    return entryDate.toDateString() === today.toDateString();
  });

  const handleCreateEntry = async () => {
    if (!newEntryContent.trim() || !newEntryMood) {
      toast.error("Please fill in all fields");
      return;
    }
    setSavingEntry(true);
    try {
      const tags = newEntryTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await addEntry(newEntryContent, newEntryMood, tags);
      setNewEntryContent("");
      setNewEntryMood(null);
      setNewEntryTags("");
      setShowNewEntryModal(false);
      toast.success("Entry saved successfully!");
    } catch (error) {
      console.error("Error creating entry:", error);
      toast.error("Failed to save entry");
    } finally {
      setSavingEntry(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-text)]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <header className="bg-[var(--color-surface)] shadow-sm border-b border-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--color-text)" }}
              >
                Welcome back, {userProfile?.displayName}! 👋
              </h1>
              <p
                className="mt-1"
                style={{ color: "var(--color-text)", opacity: 0.8 }}
              >
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowNewEntryModal(true)}
                className="flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>New Entry</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <section className="lg:col-span-2 space-y-8">
          {/* Today's Entries */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-semibold flex items-center"
                style={{ color: "var(--color-text)" }}
              >
                <CalendarDaysIcon className="h-6 w-6 mr-2 text-[var(--color-primary)]" />
                Today's Entries
              </h2>
              {todayEntries.length > 0 && (
                <span
                  style={{ color: "var(--color-text)", opacity: 0.7 }}
                  className="text-sm"
                >
                  {todayEntries.length} entr
                  {todayEntries.length === 1 ? "y" : "ies"}
                </span>
              )}
            </div>

            {todayEntries.length > 0 ? (
              <div className="space-y-4">
                {todayEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[var(--color-surface)] rounded-xl border border-[var(--color-surface)]">
                <div className="text-6xl mb-4">📝</div>
                <h3
                  className="text-lg font-medium mb-2"
                  style={{ color: "var(--color-text)" }}
                >
                  No entries today yet
                </h3>
                <p
                  className="mb-4"
                  style={{ color: "var(--color-text)", opacity: 0.8 }}
                >
                  Start your day by capturing your thoughts and feelings
                </p>
                <Button onClick={() => setShowNewEntryModal(true)}>
                  Write your first entry today
                </Button>
              </div>
            )}
          </div>

          {/* Recent Entries */}
          {entries.length > todayEntries.length && (
            <section>
              <h2
                className="text-xl font-semibold mb-6"
                style={{ color: "var(--color-text)" }}
              >
                Recent Entries
              </h2>
              <div className="space-y-4">
                {entries
                  .filter((entry) => !todayEntries.includes(entry))
                  .slice(0, 5)
                  .map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
              </div>
            </section>
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Writing Streak */}
          {analytics && (
            <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-surface)]">
              <div className="flex items-center mb-4">
                <FireIcon className="h-6 w-6 text-orange-500 mr-2" />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  Writing Streak
                </h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-[var(--color-primary)]">
                  {analytics.streakDays}
                </div>
                <p style={{ color: "var(--color-text)", opacity: 0.8 }}>
                  day{analytics.streakDays === 1 ? "" : "s"} in a row
                </p>
              </div>
            </div>
          )}

          {/* Mood Overview */}
          {analytics && (
            <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-surface)]">
              <div className="flex items-center mb-4">
                <ChartBarIcon className="h-6 w-6 text-[var(--color-secondary)] mr-2" />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  Mood Overview
                </h3>
              </div>
              <div className="space-y-3">
                {Object.entries(analytics.moodDistribution)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 4)
                  .map(([mood, count]) => (
                    <div
                      key={mood}
                      className="flex items-center justify-between"
                    >
                      <MoodBadge mood={mood as Mood} size="small" />
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text)", opacity: 0.8 }}
                      >
                        {String(count)} time{count === 1 ? "" : "s"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          {insights.length > 0 && (
            <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-surface)]">
              <div className="flex items-center mb-4">
                <SparklesIcon className="h-6 w-6 text-yellow-500 mr-2" />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  Insights
                </h3>
              </div>
              <div className="space-y-3">
                {insights.map((insight: string, index: number) => (
                  <p
                    key={index}
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text)", opacity: 0.8 }}
                  >
                    {insight}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          {analytics && (
            <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-surface)]">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--color-text)" }}
              >
                Your Journey
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-text)", opacity: 0.8 }}>
                    Total entries
                  </span>
                  <span className="font-medium">{analytics.totalEntries}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-text)", opacity: 0.8 }}>
                    This week
                  </span>
                  <span className="font-medium">
                    {analytics.weeklyMoodTrend.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-text)", opacity: 0.8 }}>
                    Current streak
                  </span>
                  <span className="font-medium">
                    {analytics.streakDays} days
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* New Entry Modal */}
      <Modal
        isOpen={showNewEntryModal}
        onClose={() => setShowNewEntryModal(false)}
        title="Write New Entry"
        size="large"
      >
        <div className="space-y-6 text-[var(--color-primary)]">
          <MoodSelector
            selectedMood={newEntryMood}
            onMoodSelect={setNewEntryMood}
          />

          {/* Thoughts Textarea */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Your thoughts
            </label>
            <textarea
              value={newEntryContent}
              onChange={(e) => setNewEntryContent(e.target.value)}
              placeholder="What's on your mind today?"
              className="
          w-full h-32 px-3 py-2 rounded-lg border 
          bg-[var(--color-surface)] 
          text-[var(--color-text)] 
          placeholder-opacity-60 
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] 
          focus:border-[var(--color-primary)] resize-none
        "
            />
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              value={newEntryTags}
              onChange={(e) => setNewEntryTags(e.target.value)}
              placeholder="work, family, health (separated by commas)"
              className="
          w-full px-3 py-2 border rounded-lg 
          bg-[var(--color-surface)] 
          text-[var(--color-text)] 
          placeholder-opacity-60 
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] 
          focus:border-[var(--color-primary)]
        "
            />
            <p className="text-xs mt-1 opacity-70">
              Add tags to organize your entries
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--color-surface)]">
            <Button
              variant="outline"
              onClick={() => setShowNewEntryModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEntry}
              loading={savingEntry}
              disabled={!newEntryContent.trim() || !newEntryMood}
            >
              Save Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
