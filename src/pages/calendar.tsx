import React, { useState, useMemo } from "react";
import { useDiary } from "@/contexts/DiaryContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MoodBadge } from "@/components/MoodSelector";
import { groupEntriesByDate } from "@/utils/date";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import withAuth from "@/utils/withAuth";

const CalendarPage: React.FC = () => {
  const { entries, loading } = useDiary();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const groupedEntries = useMemo(() => groupEntriesByDate(entries), [entries]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays: (number | null)[] = [];

  // Fill empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Fill days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(
        direction === "prev" ? newDate.getMonth() - 1 : newDate.getMonth() + 1
      );
      return newDate;
    });
    setSelectedDate(null);
  };

  const handleDateClick = (day: number) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    setSelectedDate(selectedDate === dateKey ? null : dateKey);
  };

  const getEntriesForDate = (day: number) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    return groupedEntries[dateKey] || [];
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <LoadingSpinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <header
        className="shadow-sm border-b"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1
            className="text-3xl font-bold flex items-center"
            style={{ color: "var(--color-text)" }}
          >
            <CalendarDaysIcon className="h-8 w-8 mr-3 text-[var(--color-primary)]" />
            Journal Calendar
          </h1>
          <p className="mt-2 text-[var(--color-text)] opacity-70">
            Navigate through your entries by date
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              {/* Calendar Header */}
              <div
                className="flex items-center justify-between p-6 border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <button
                  title="Previous Month"
                  onClick={() => navigateMonth("prev")}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--color-background)]"
                  type="button"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-[var(--color-text)]" />
                </button>

                <h2
                  className="text-xl font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  {monthNames[currentMonth]} {currentYear}
                </h2>

                <button
                  title="Next Month"
                  onClick={() => navigateMonth("next")}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--color-background)]"
                  type="button"
                >
                  <ChevronRightIcon className="h-5 w-5 text-[var(--color-text)]" />
                </button>
              </div>

              {/* Day Headers */}
              <div
                className="grid grid-cols-7 gap-px"
                style={{ backgroundColor: "var(--color-border)" }}
              >
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="p-4 text-center"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text)", opacity: 0.7 }}
                    >
                      {day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div
                className="grid grid-cols-7 gap-px"
                style={{ backgroundColor: "var(--color-border)" }}
              >
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return (
                      <div
                        key={`empty-${index}`}
                        style={{ backgroundColor: "var(--color-surface)" }}
                        className="h-20"
                      />
                    );
                  }

                  const dayEntries = getEntriesForDate(day);
                  const dateKey = `${currentYear}-${String(
                    currentMonth + 1
                  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isSelected = selectedDate === dateKey;
                  const hasEntries = dayEntries.length > 0;

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className="relative h-20 p-2 text-left transition-colors"
                      style={{
                        backgroundColor: isSelected
                          ? "var(--color-primary)/0.1"
                          : "var(--color-surface)",
                        border: isSelected
                          ? "2px solid var(--color-primary)"
                          : undefined,
                        fontWeight: hasEntries ? "600" : "normal",
                        color: "var(--color-text)",
                      }}
                      type="button"
                    >
                      <span className="text-sm">{day}</span>

                      {/* Entry indicators */}
                      {hasEntries && (
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="flex space-x-1">
                            {dayEntries.slice(0, 3).map((entry, entryIndex) => {
                              const moodColors: Record<
                                | "happy"
                                | "sad"
                                | "angry"
                                | "anxious"
                                | "excited"
                                | "calm"
                                | "frustrated"
                                | "content",
                                string
                              > = {
                                happy: "#FCD34D",
                                sad: "#60A5FA",
                                angry: "#F87171",
                                anxious: "#A78BFA",
                                excited: "#FB923C",
                                calm: "#34D399",
                                frustrated: "#6B7280",
                                content: "#10B981",
                              };
                              const mood =
                                entry.mood as keyof typeof moodColors;
                              return (
                                <div
                                  key={entryIndex}
                                  className="flex-1 h-1 rounded"
                                  style={{
                                    backgroundColor:
                                      moodColors[mood] || "var(--color-border)",
                                  }}
                                />
                              );
                            })}
                          </div>
                          {dayEntries.length > 3 && (
                            <span
                              className="text-xs mt-1"
                              style={{
                                color: "var(--color-text)",
                                opacity: 0.5,
                              }}
                            >
                              +{dayEntries.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Selected Date Entries */}
          <div className="space-y-6">
            {selectedDate ? (
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--color-text)" }}
                >
                  Entries for{" "}
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </h3>

                {groupedEntries[selectedDate]?.length > 0 ? (
                  <div className="space-y-4">
                    {groupedEntries[selectedDate].map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-lg p-4 border"
                        style={{
                          backgroundColor: "var(--color-surface)",
                          borderColor: "var(--color-border)",
                          color: "var(--color-text)",
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <MoodBadge mood={entry.mood} size="small" />
                          <span className="text-sm opacity-70">
                            {new Date(entry.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        <div
                          className="prose prose-sm"
                          style={{ color: "var(--color-text)" }}
                          dangerouslySetInnerHTML={{
                            __html:
                              entry.content.length > 150
                                ? entry.content.substring(0, 150) + "..."
                                : entry.content,
                          }}
                        />
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.tags
                              .slice(0, 3)
                              .map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 rounded"
                                  style={{
                                    backgroundColor: "var(--color-background)",
                                    color: "var(--color-text)",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  #{tag}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-center py-8"
                    style={{ color: "var(--color-text)", opacity: 0.6 }}
                  >
                    No entries for this date
                  </p>
                )}
              </div>
            ) : (
              <div
                className="text-center py-12"
                style={{ color: "var(--color-text)", opacity: 0.4 }}
              >
                <CalendarDaysIcon className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Date</h3>
                <p>Click on any date in the calendar to view your entries</p>
              </div>
            )}

            {/* This Month Summary */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              <h3 className="text-lg font-semibold mb-4">This Month</h3>

              {Object.keys(groupedEntries).some((date) => {
                const entryDate = new Date(date + "T00:00:00");
                return (
                  entryDate.getMonth() === currentMonth &&
                  entryDate.getFullYear() === currentYear
                );
              }) ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="opacity-70">Total entries</span>
                    <span className="font-medium">
                      {Object.keys(groupedEntries).reduce((total, date) => {
                        const entryDate = new Date(date + "T00:00:00");
                        if (
                          entryDate.getMonth() === currentMonth &&
                          entryDate.getFullYear() === currentYear
                        ) {
                          return total + groupedEntries[date].length;
                        }
                        return total;
                      }, 0)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="opacity-70">Days with entries</span>
                    <span className="font-medium">
                      {
                        Object.keys(groupedEntries).filter((date) => {
                          const entryDate = new Date(date + "T00:00:00");
                          return (
                            entryDate.getMonth() === currentMonth &&
                            entryDate.getFullYear() === currentYear
                          );
                        }).length
                      }
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4 opacity-70">
                  No entries this month yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(CalendarPage);
