'use client';

import { Book } from "@/app/types/book";
import BookCard from "./BookCard";
import { useState } from "react";

interface BookListProps {
  books: Book[];
  onEditBook?: (book: Book) => void;
  onDeleteBook?: (bookId: string) => void;
}

export default function BookList({ books, onEditBook, onDeleteBook }: BookListProps) {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredBooks = books.filter(book => {
    const matchesFilter = filter === "all" || book.status === filter;
    const matchesSearch = book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.genero.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Filtros e busca */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Barra de busca */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar por título, autor ou gênero..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por status */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter("Quero Ler")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "Quero Ler" 
                  ? "bg-yellow-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Quero Ler
            </button>
            <button
              onClick={() => setFilter("Lendo")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "Lendo" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Lendo
            </button>
            <button
              onClick={() => setFilter("Lido")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "Lido" 
                  ? "bg-green-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Lidos
            </button>
          </div>
        </div>
      </div>

      {/* Grid de livros */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Nenhum livro encontrado
          </h3>
          <p className="text-gray-500">
            {books.length === 0 
              ? "Comece adicionando seu primeiro livro à biblioteca!" 
              : "Tente ajustar os filtros ou termos de busca."}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'livro encontrado' : 'livros encontrados'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={onEditBook}
                onDelete={onDeleteBook}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}