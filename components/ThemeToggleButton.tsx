"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed top-4 right-4 z-50 bg-muted hover:bg-muted/70"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-gray-700" />}
    </Button>
  );
}
