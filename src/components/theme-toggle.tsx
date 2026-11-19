"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("mio-theme");
    const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = stored ? stored === "dark" : prefersDark;
    document.documentElement.dataset.theme = enabled ? "dark" : "light";
    const frame = requestAnimationFrame(() => setDark(enabled));
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("mio-theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button className="icon-button" type="button" onClick={toggle} aria-label="Cambiar tema">
      {dark ? <Sun aria-hidden="true" size={17} /> : <Moon aria-hidden="true" size={17} />}
    </button>
  );
}
