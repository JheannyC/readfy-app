"use client";
import { useTheme } from "next-themes";
import { Moon, Sun, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "../ui/DropdownMenu";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Placeholder neutro enquanto hidrata
    return (
      <Button
        variant="ghost"
        size="sm"
        aria-label="Alternar tema"
        className="rounded-2xl flex items-center gap-2 px-3"
      >
        <Sun className="w-5 h-5 text-foreground" />
      
      </Button>
    );
  }

  // Ícone de acordo com o tema atual
  const icon =
    theme === "dark" ? <Moon className="w-5 h-5 text-foreground" /> :
    theme === "light" ? <Sun className="w-5 h-5 text-foreground" /> :
    <BookOpen className="w-5 h-5 text-foreground" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Alternar tema"
          className="rounded-2xl flex items-center gap-2 px-3 hover:scale-105 transition-transform duration-300"
        >
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="gap-2 cursor-pointer transition-colors"
        >
          <Sun className="w-5 h-5 text-yellow-500" /> <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="gap-2 cursor-pointer transition-colors"
        >
          <Moon className="w-5 h-5 text-blue-400" /> <span>Escuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("book")}
          className="gap-2 cursor-pointer transition-colors"
        >
          <BookOpen className="w-5 h-5 text-amber-600" /> <span>Livro</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
