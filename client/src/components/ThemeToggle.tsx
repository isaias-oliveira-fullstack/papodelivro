import { useState, useEffect } from "react";
import { Theme } from "@/types";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  }, [theme]);

  const onToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="fixed top-1/2 left-6 -translate-x-1/2 z-50 rotate-90">
      <div className="relative z-0 inline-grid grid-cols-2 gap-0.5 rounded-full bg-gray-950/5 p-1 border-2 border-gray-300 dark:border-white/10 text-gray-950 dark:bg-white/5 dark:text-white w-13 h-7 shadow-lg duration-300">
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-primary dark:bg-dark-primary rounded-full transition-transform duration-300 ease-in-out ${
            theme === "light" ? "translate-x-full" : ""
          }`}
        />

        <i
          onClick={onToggleTheme}
          className={`absolute top-1/2 -translate-y-1/2
  ${
    theme === "light"
      ? "left-[58%] lni lni-moon-half-right-5"
      : "left-[8%] lni lni-sun-1"
  }
  text-gray-100 cursor-pointer flex items-center justify-center
  w-4 h-4 transition-all duration-300`}
        ></i>
      </div>
    </div>
  );
};

export default ThemeToggle;
