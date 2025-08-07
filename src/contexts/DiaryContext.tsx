// contexts/DiaryContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  DiaryEntry,
  getMoodEntries,
  saveMoodEntry,
  updateMoodEntry,
  deleteMoodEntry,
} from "@/utils/diary";

export type Mood =
  | "happy"
  | "sad"
  | "angry"
  | "anxious"
  | "excited"
  | "calm"
  | "frustrated"
  | "content";

interface DiaryContextType {
  entries: DiaryEntry[];
  loading: boolean;
  addEntry: (content: string, mood: Mood, tags?: string[]) => Promise<void>;
  updateEntry: (
    id: string,
    content: string,
    mood: Mood,
    tags?: string[]
  ) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const useDiary = (): DiaryContextType => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error("useDiary must be used within a DiaryProvider");
  }
  return context;
};

interface DiaryProviderProps {
  children: ReactNode;
}

export const DiaryProvider: React.FC<DiaryProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getMoodEntries(user.uid);
      setEntries(data);
    } catch (error) {
      console.error("Failed to load diary entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [user]);

  const addEntry = async (content: string, mood: Mood, tags?: string[]) => {
    if (!user) return;
    await saveMoodEntry(user.uid, content, mood, tags);
    await refresh();
  };

  const updateEntry = async (
    id: string,
    content: string,
    mood: Mood,
    tags?: string[]
  ) => {
    if (!user) return;
    await updateMoodEntry(id, content, mood, tags);
    await refresh();
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;
    await deleteMoodEntry(id);
    await refresh();
  };

  return (
    <DiaryContext.Provider
      value={{ entries, loading, addEntry, updateEntry, deleteEntry, refresh }}
    >
      {children}
    </DiaryContext.Provider>
  );
};
