import React from "react";
import { Mood } from "@/contexts/DiaryContext";

const moodEmojis: Record<Mood, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  anxious: "😰",
  excited: "🤩",
  calm: "😌",
  frustrated: "😤",
  content: "😊",
};

const moodColors: Record<Mood, string> = {
  happy:
    "bg-[var(--color-happy-bg)] border-[var(--color-happy-border)] text-[var(--color-happy-text)]",
  sad: "bg-[var(--color-sad-bg)] border-[var(--color-sad-border)] text-[var(--color-sad-text)]",
  angry:
    "bg-[var(--color-angry-bg)] border-[var(--color-angry-border)] text-[var(--color-angry-text)]",
  anxious:
    "bg-[var(--color-anxious-bg)] border-[var(--color-anxious-border)] text-[var(--color-anxious-text)]",
  excited:
    "bg-[var(--color-excited-bg)] border-[var(--color-excited-border)] text-[var(--color-excited-text)]",
  calm: "bg-[var(--color-calm-bg)] border-[var(--color-calm-border)] text-[var(--color-calm-text)]",
  frustrated:
    "bg-[var(--color-frustrated-bg)] border-[var(--color-frustrated-border)] text-[var(--color-frustrated-text)]",
  content:
    "bg-[var(--color-content-bg)] border-[var(--color-content-border)] text-[var(--color-content-text)]",
};

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
  className?: string;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onMoodSelect,
  className = "",
}) => {
  const moods: Mood[] = [
    "happy",
    "sad",
    "angry",
    "anxious",
    "excited",
    "calm",
    "frustrated",
    "content",
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <label
        className="block text-sm font-medium"
        style={{ color: "var(--color-text)" }}
      >
        How are you feeling?
      </label>

      <div className="grid grid-cols-4 gap-2">
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => onMoodSelect(mood)}
            className={`
              p-3 rounded-xl border-2 transition-all duration-200 text-center
              hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500
              ${
                selectedMood === mood
                  ? `${moodColors[mood]} border-opacity-100 shadow-md scale-105`
                  : "bg-white border-neutral-200 hover:border-neutral-300"
              }
            `}
          >
            <div className="text-2xl mb-1">{moodEmojis[mood]}</div>
            <div className="text-xs font-medium capitalize">{mood}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

interface MoodBadgeProps {
  mood: Mood;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
}

export const MoodBadge: React.FC<MoodBadgeProps> = ({
  mood,
  size = "medium",
  showLabel = true,
}) => {
  const sizeClasses = {
    small: "px-2 py-1 text-xs",
    medium: "px-3 py-1.5 text-sm",
    large: "px-4 py-2 text-base",
  };

  const emojiSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <span
      className={`
      inline-flex items-center rounded-full border
      ${moodColors[mood]}
      ${sizeClasses[size]}
    `}
    >
      <span className={`${emojiSizes[size]} mr-1`}>{moodEmojis[mood]}</span>
      {showLabel && <span className="font-medium capitalize">{mood}</span>}
    </span>
  );
};
