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

  const icon =
    theme === "dark" ? (
      <Moon className="size-4" />
    ) : theme === "light" ? (
      <Sun className="size-4" />
    ) : (
      <BookOpen className="size-4" />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Alternar tema"
          className="rounded-2xl theme-toggle transition-all duration-300 hover:scale-110"
        >
          {mounted ? icon : <Sun className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className="gap-2 cursor-pointer transition-colors"
        >
          <Sun className="size-4 text-yellow-500" /> 
          <span>Tema Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className="gap-2 cursor-pointer transition-colors"
        >
          <Moon className="size-4 text-blue-400" /> 
          <span>Tema Escuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("book")} 
          className="gap-2 cursor-pointer transition-colors"
        >
          <BookOpen className="size-4 text-amber-600" /> 
          <span>Modo Livro</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
