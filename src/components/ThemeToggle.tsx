import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer select-none"
      onClick={toggle}
      title="Toggle Light/Dark Theme"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") toggle();
      }}
    >
      <span className="text-sm">{theme === "light" ? "🌞" : "🌙"}</span>
      <div
        className={`relative w-10 h-5 rounded-full transition-colors select-none ${
          theme === "dark" ? "bg-purple-600" : "bg-gray-400"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
            theme === "dark" ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
};

export default ThemeToggle;
