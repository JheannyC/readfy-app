"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme/ThemeToggle";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-background shadow-sm border-b border-border z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/icon.png" alt="Readfy" className="h-10 w-auto" />
            <span className="text-xl font-bold text-foreground">Readfy</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Início
            </Link>
            <Link
              href="/v1/dashboard"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/v1/books"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Livros cadastrados
            </Link>
            <Link
              href="/v1/book/register"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2 transition-all"
            >
              <Plus size={18} />
              Novo Livro
            </Link>

            {/* Theme toggle na última posição */}
            <ThemeToggle />
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-foreground/80 hover:text-foreground transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden flex flex-col mt-2 space-y-2 pb-2 border-t border-border transition-colors ${
            open ? "block" : "hidden"
          }`}
        >
          <Link
            href="/"
            className="text-foreground/80 hover:text-foreground transition-colors py-2"
            onClick={() => setOpen(false)}
          >
            Início
          </Link>
          <Link
            href="/v1/dashboard"
            className="text-foreground/80 hover:text-foreground transition-colors py-2"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/v1/books"
            className="text-foreground/80 hover:text-foreground transition-colors py-2"
            onClick={() => setOpen(false)}
          >
            Livros cadastrados
          </Link>
          <Link
            href="/v1/book/register"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 justify-center transition-all"
            onClick={() => setOpen(false)}
          >
            <Plus size={18} />
            Novo Livro
          </Link>

          {/* Theme toggle na última posição no mobile */}
          <div className="pt-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
