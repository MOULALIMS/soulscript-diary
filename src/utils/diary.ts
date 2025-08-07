// utils/diary.ts
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Mood } from "@/contexts/DiaryContext";
import { encryptData, decryptData } from "@/utils/crypto";

export interface DiaryEntry {
  id: string;
  userId: string;
  content: string; // decrypted content
  mood: Mood;
  tags: string[];
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const saveMoodEntry = async (
  userId: string,
  content: string,
  mood: Mood,
  tags: string[] = [],
  images: string[] = []
): Promise<void> => {
  try {
    const encryptedContent = encryptData(content);
    await addDoc(collection(db, "entries"), {
      userId,
      content: encryptedContent,
      mood,
      tags,
      images,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error saving entry:", error);
    throw error;
  }
};

export const getMoodEntries = async (userId: string): Promise<DiaryEntry[]> => {
  try {
    const q = query(
      collection(db, "entries"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const entries: DiaryEntry[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      let decryptedContent = "";
      try {
        decryptedContent = decryptData(data.content);
      } catch {
        decryptedContent = "[Decryption failed]";
      }
      entries.push({
        id: docSnap.id,
        userId: data.userId,
        content: decryptedContent,
        mood: data.mood,
        tags: data.tags || [],
        images: data.images || [],
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });

    return entries;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
};

export const updateMoodEntry = async (
  entryId: string,
  content: string,
  mood: Mood,
  tags: string[] = []
): Promise<void> => {
  try {
    const entryRef = doc(db, "entries", entryId);
    const encryptedContent = encryptData(content);
    await updateDoc(entryRef, {
      content: encryptedContent,
      mood,
      tags,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error;
  }
};

export const deleteMoodEntry = async (entryId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "entries", entryId));
  } catch (error) {
    console.error("Error deleting entry:", error);
    throw error;
  }
};

export interface MoodAnalytics {
  moodDistribution: Record<Mood, number>;
  weeklyMoodTrend: {
    date: string; // ISO date string (YYYY-MM-DD)
    mood: Mood;
    count: number; // Number of entries on that date
  }[];
  streakDays: number;
  totalEntries: number;
}

/**
 * Analyzes an array of diary entries to produce aggregate mood analytics.
 */
export function getMoodAnalytics(entries: DiaryEntry[]): MoodAnalytics {
  // Initialize counters
  const moodDistribution: Record<Mood, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    excited: 0,
    calm: 0,
    frustrated: 0,
    content: 0,
  };

  for (const entry of entries) {
    if (moodDistribution[entry.mood] !== undefined) {
      moodDistribution[entry.mood]++;
    }
  }

  // Calculate streak of consecutive days starting from today
  let streakDays = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < entries.length; i++) {
    const entryDate = new Date(entries[i].createdAt);
    entryDate.setHours(0, 0, 0, 0);
    const dayDiff = Math.floor(
      (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff === streakDays) {
      streakDays++;
    } else if (dayDiff > streakDays) {
      break; // streak broken
    }
  }

  // Build weekly mood trend over the last 7 days (oldest first)
  const weeklyMoodTrend: { date: string; mood: Mood; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().slice(0, 10); // YYYY-MM-DD

    const entriesOnDate = entries.filter(
      (entry) =>
        new Date(entry.createdAt).setHours(0, 0, 0, 0) === date.getTime()
    );

    if (entriesOnDate.length > 0) {
      const dayMoodCount: Record<Mood, number> = {
        happy: 0,
        sad: 0,
        angry: 0,
        anxious: 0,
        excited: 0,
        calm: 0,
        frustrated: 0,
        content: 0,
      };

      for (const entry of entriesOnDate) {
        dayMoodCount[entry.mood]++;
      }

      const mostFrequentMood = Object.entries(dayMoodCount).reduce(
        (max, current) => (current[1] > max[1] ? current : max)
      )[0] as Mood;

      weeklyMoodTrend.push({
        date: dateString,
        mood: mostFrequentMood,
        count: entriesOnDate.length,
      });
    } else {
      weeklyMoodTrend.push({
        date: dateString,
        mood: "content",
        count: 0,
      });
    }
  }

  return {
    moodDistribution,
    weeklyMoodTrend,
    streakDays,
    totalEntries: entries.length,
  };
}

/**
 * Generates an array of user-friendly textual insights based on diary entries.
 */
export function getMoodInsights(entries: DiaryEntry[]): string[] {
  if (entries.length === 0) return [];

  const insights: string[] = [];
  const analytics = getMoodAnalytics(entries);

  const mostCommonMood = Object.entries(analytics.moodDistribution).reduce(
    (max, current) => (current[1] > max[1] ? current : max)
  )[0] as Mood;

  insights.push(`Your most common mood this week is **${mostCommonMood}**.`);

  if (analytics.streakDays > 1) {
    insights.push(
      `You're on a journaling streak of ${analytics.streakDays} days! Keep going!`
    );
  }

  const recentMoods = analytics.weeklyMoodTrend.slice(-3).map((d) => d.mood);

  if (
    recentMoods.every((m) =>
      ["happy", "excited", "calm", "content"].includes(m)
    )
  ) {
    insights.push(
      "You've been enjoying several positive days. Keep up the great work! 🌞"
    );
  } else if (
    recentMoods.every((m) =>
      ["sad", "angry", "anxious", "frustrated"].includes(m)
    )
  ) {
    insights.push(
      "You seem to have had a few tough days. Remember, it's okay to feel those emotions."
    );
  }

  if (analytics.totalEntries >= 7) {
    insights.push("You’re building a consistent journaling habit — well done!");
  }

  return insights;
}
