import React, { useMemo } from "react";
import { useDiary } from "@/contexts/DiaryContext";
import { getMoodAnalytics } from "@/utils/diary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MoodBadge } from "@/components/MoodSelector";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  ChartBarIcon,
  FireIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const moodColors: Record<string, string> = {
  happy: "#FCD34D",
  sad: "#60A5FA",
  angry: "#F87171",
  anxious: "#A78BFA",
  excited: "#FB923C",
  calm: "#34D399",
  frustrated: "#6B7280",
  content: "#10B981",
};

const AnalyticsPage: React.FC = () => {
  const { entries, loading } = useDiary();

  const analytics = useMemo(() => {
    if (entries.length === 0) return null;
    return getMoodAnalytics(entries);
  }, [entries]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-text)]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!analytics || entries.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <ChartBarIcon
              className="h-20 w-20 mx-auto"
              style={{ color: "var(--color-text)", opacity: 0.4 }}
            />
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ color: "var(--color-text)" }}
            >
              No Data Yet
            </h2>
            <p style={{ color: "var(--color-text)", opacity: 0.7 }}>
              Start writing entries to see your emotional insights and patterns.
            </p>
          </div>
        </div>
      </div>
    );
  }

  type MoodChartItem = {
    mood: string;
    count: number;
    fill: string;
  };

  const moodChartData: MoodChartItem[] = Object.entries(
    analytics.moodDistribution
  ).map(([mood, count]) => ({
    mood,
    count: count as number,
    fill: moodColors[mood as keyof typeof moodColors] || "#8884d8",
  }));

  interface WeeklyMoodTrendDay {
    date: string | number | Date;
    count: number;
  }

  interface WeeklyDataItem {
    date: string;
    count: number;
  }

  const weeklyData: WeeklyDataItem[] =
    analytics.weeklyMoodTrend?.map(
      (day: WeeklyMoodTrendDay): WeeklyDataItem => ({
        date: new Date(day.date).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        count: day.count,
      })
    ) || [];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <header className="bg-[var(--color-surface)] shadow-sm border-b border-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1
            className="text-3xl font-bold flex items-center"
            style={{ color: "var(--color-text)" }}
          >
            <ChartBarIcon
              className="h-8 w-8 mr-3"
              style={{ color: "var(--color-primary)" }}
            />
            Your Journal Analytics
          </h1>
          <p
            className="mt-2"
            style={{ color: "var(--color-text)", opacity: 0.8 }}
          >
            Insights into your emotional journey and writing patterns
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="rounded-xl p-6 border"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center">
              <CalendarDaysIcon
                className="h-8 w-8"
                style={{ color: "#60A5FA" }}
              />
              <div className="ml-4">
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {analytics.totalEntries}
                </p>
                <p style={{ color: "var(--color-text)", opacity: 0.7 }}>
                  Total Entries
                </p>
              </div>
            </div>
          </div>
          <div
            className="rounded-xl p-6 border"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center">
              <FireIcon className="h-8 w-8" style={{ color: "#fb923c" }} />
              <div className="ml-4">
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {analytics.streakDays}
                </p>
                <p style={{ color: "var(--color-text)", opacity: 0.7 }}>
                  Day Streak
                </p>
              </div>
            </div>
          </div>
          <div
            className="rounded-xl p-6 border"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center">
              <ArrowTrendingUpIcon
                className="h-8 w-8"
                style={{ color: "#10b981" }}
              />
              <div className="ml-4">
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {analytics.weeklyMoodTrend.length}
                </p>
                <p style={{ color: "var(--color-text)", opacity: 0.7 }}>
                  Days This Week
                </p>
              </div>
            </div>
          </div>
          <div
            className="rounded-xl p-6 border"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8" style={{ color: "#a78bfa" }} />
              <div className="ml-4">
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {
                    Object.keys(analytics.moodDistribution).filter(
                      (mood) =>
                        analytics.moodDistribution[
                          mood as keyof typeof analytics.moodDistribution
                        ] > 0
                    ).length
                  }
                </p>
                <p style={{ color: "var(--color-text)", opacity: 0.7 }}>
                  Unique Moods
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Mood Distribution Bar Chart */}
          <div
            className="rounded-xl p-6 border"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--color-text)" }}
            >
              Mood Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moodChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="mood"
                  tick={{ fontSize: 12, fill: "var(--color-text)" }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: "var(--color-text)" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                  formatter={(value: number) => [value, "Entries"]}
                  labelFormatter={(label: string) => `Mood: ${label}`}
                />
                <Bar dataKey="count">
                  {moodChartData.map((entry, idx) => (
                    <Cell key={entry.mood} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Mood Distribution Pie Chart */}
          <div
            className="rounded-xl p-6 border"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--color-text)" }}
            >
              Mood Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodChartData.filter((item) => item.count > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ mood, percent }) =>
                    percent && percent > 0.05
                      ? `${mood} ${(percent * 100).toFixed(0)}%`
                      : ""
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {moodChartData
                    .filter((item) => item.count > 0)
                    .map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                  formatter={(value: number) => [value, "Entries"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity */}
        <div
          className="rounded-xl p-6 border mb-8"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--color-text)" }}
          >
            Weekly Writing Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "var(--color-text)" }} />
              <YAxis tick={{ fill: "var(--color-text)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
                formatter={(value: number) => [value, "Entries"]}
                labelFormatter={(label: string) => `${label}`}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: "var(--color-primary)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Most Used Moods */}
        <div
          className="rounded-xl p-6 border"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--color-text)" }}
          >
            Your Most Common Moods
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(analytics.moodDistribution)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .filter(([, count]) => (count as number) > 0)
              .map(([mood, count]) => (
                <div
                  key={mood}
                  className="text-center p-4 rounded-lg"
                  style={{ background: "var(--color-background)" }}
                >
                  <div className="mb-2">
                    <MoodBadge
                      mood={mood as any}
                      showLabel={false}
                      size="large"
                    />
                  </div>
                  <p
                    className="text-sm font-medium capitalize mb-1"
                    style={{ color: "var(--color-text)" }}
                  >
                    {mood}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text)", opacity: 0.7 }}
                  >
                    {count as number} time{(count as number) === 1 ? "" : "s"}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
