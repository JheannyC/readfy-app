"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/icon.png" alt="Readfy" className="h-10 w-auto" />
            <span className="text-xl font-bold"> Readfy</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Início
            </Link>
            <Link
              href="/frontend/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/frontend/book/register"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus size={18} />
              Novo Livro
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden flex flex-col mt-2 space-y-2 pb-2 border-t border-gray-200">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Início
            </Link>
            <Link
              href="/frontend/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/book/register"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={18} />
              Novo Livro
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
