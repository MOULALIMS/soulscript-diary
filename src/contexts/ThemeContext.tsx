import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Theme = "light" | "dark" | "vintage" | "minimal";

export interface ThemeDefinition {
  id: Theme;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    border: string; // Optional for themes that don't use borders
  };
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: ThemeDefinition[];
}

// IMPORTANT: Export the ThemeContext so it can be used in components
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

// Custom hook to consume the ThemeContext safely
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

const themes: ThemeDefinition[] = [
  {
    id: "light",
    name: "Light & Bright",
    description: "Clean and fresh for daily writing",
    colors: {
      primary: "#3B82F6", // Blue
      secondary: "#EC4899", // Pink
      background: "#fdfdfdff", // Pure white
      surface: "#F8FAFC", // Light gray surface
      text: "#1E293B", // Slate dark text
      border: "#E5E7EB",
    },
  },
  {
    id: "dark",
    name: "Dark & Cozy",
    description: "Easy on the eyes for evening journaling",
    colors: {
      primary: "#60A5FA", // Lighter blue
      secondary: "#F472B6", // Soft pink
      background: "#0F172A", // Deep navy
      surface: "#1E293B", // Slate dark surface
      text: "#F1F5F9", // Light text
      border: "#334155",
    },
  },
  {
    id: "vintage",
    name: "Vintage Paper",
    description: "Classic notebook feel",
    colors: {
      primary: "#b45309", // Gold brown
      secondary: "#a16207", // Yellow ochre
      background: "#fef3e8", // Very light beige
      surface: "#fcd8b6", // Light parchment
      text: "#4e2803", // Brown ink
      border: "#d97706", // Darker gold for borders
    },
  },
  {
    id: "minimal",
    name: "Minimal Focus",
    description: "Distraction-free writing",
    colors: {
      primary: "#6b7280", // Cool gray
      secondary: "#a3a3a3", // Light gray
      background: "#f8fafc", // Almost white
      surface: "#f3f4f6", // Soft gray surface
      text: "#374151", // Slate
      border: "#d1d5db", // Light gray border
    },
  },
];

interface Props {
  children: ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("light");

  // Helper to apply theme CSS variables and body class
  const applyTheme = (themeId: Theme) => {
    const selected = themes.find((t) => t.id === themeId);
    if (!selected) return;
    const root = document.documentElement;

    // Set basic colors
    root.style.setProperty("--color-primary", selected.colors.primary);
    root.style.setProperty("--color-secondary", selected.colors.secondary);
    root.style.setProperty("--color-background", selected.colors.background);
    root.style.setProperty("--color-surface", selected.colors.surface);
    root.style.setProperty("--color-text", selected.colors.text);
    root.style.setProperty("--color-border", selected.colors.border);

    // Set gradient background for light and dark themes only
    if (themeId === "light") {
      root.style.setProperty(
        "--color-background-gradient",
        "linear-gradient(135deg, #eef2ff, #fef3c7)" // example soft gradient colors
      );
    } else if (themeId === "dark") {
      root.style.setProperty(
        "--color-background-gradient",
        "linear-gradient(135deg, #0f172a, #1e293b)" // dark gradient matching your dark theme
      );
    } else {
      // Remove gradient for other themes (fallback to solid)
      root.style.removeProperty("--color-background-gradient");
    }

    // Update body class for easier global style overrides if needed
    document.body.classList.remove(
      "theme-light",
      "theme-dark",
      "theme-vintage",
      "theme-minimal"
    );
    document.body.classList.add(`theme-${themeId}`);
  };

  // Initialize theme from localStorage or fallback
  useEffect(() => {
    const saved = localStorage.getItem("diary-theme") as Theme | null;
    const next = saved && themes.some((t) => t.id === saved) ? saved : theme;
    setThemeState(next);
    applyTheme(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("diary-theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
