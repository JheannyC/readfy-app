"use client";

import { Book } from "@/app/types/book";
import Link from "next/link";

interface BookCardProps {
  book: Book;
  onDelete?: (bookId: string) => void;
  deletingBookId?: string | null;
}

export default function BookCard({ book, onDelete, deletingBookId }: BookCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Lido":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Lendo":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Quero Ler":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Lido":
        return "Lido";
      case "Lendo":
        return "Lendo";
      case "Quero Ler":
        return "Quero Ler";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Lido":
        return "✅";
      case "Lendo":
        return "📖";
      case "Quero Ler":
        return "📚";
      default:
        return "📖";
    }
  };

  const getRatingStars = (rating: number) => {
    if (!rating || rating === 0) return null;
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Imagem do livro */}
      <div className="h-48 bg-gray-100 overflow-hidden">
        {book.imgURL ? (
          <img
            src={book.imgURL}
            alt={`Capa do livro ${book.titulo}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📚</div>
              <span className="text-sm font-medium">Sem imagem</span>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        {/* Cabeçalho com título e status */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 mr-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-1">
              {book.titulo}
            </h3>
            <p className="text-sm text-gray-600">
              por <span className="font-medium">{book.autor}</span>
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              book.status
            )}`}
            title={getStatusText(book.status)}
          >
            <span className="mr-1">{getStatusIcon(book.status)}</span>
            {getStatusText(book.status)}
          </span>
        </div>

        {/* Informações do livro */}
        <div className="space-y-2 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Gênero:</span>
            <span className="text-sm font-medium text-gray-900">{book.genero}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Ano:</span>
            <span className="text-sm font-medium text-gray-900">{book.anoPublicacao}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Páginas:</span>
            <span className="text-sm font-medium text-gray-900">{book.paginas}</span>
          </div>

          {/* Avaliação */}
          {book.avaliacao && book.avaliacao > 0 && (
            <div className="flex justify-between items-center pt-1 border-t border-gray-100">
              <span className="text-sm text-gray-600">Avaliação:</span>
              <span className="text-yellow-500 text-sm font-medium">
                {getRatingStars(book.avaliacao)}
                <span className="text-gray-500 text-xs ml-1">
                  ({book.avaliacao}/5)
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
          <Link
            href={`/book/${book.id}/edit`}
            className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Editar livro"
          >
            <span className="text-lg">✏️</span>
          </Link>
          
          <button
            onClick={() => onDelete?.(book.id)}
            disabled={deletingBookId === book.id}
            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 ${
              deletingBookId === book.id
                ? 'text-gray-300 cursor-not-allowed bg-gray-100'
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
            title={deletingBookId === book.id ? "Excluindo..." : "Excluir livro"}
          >
            <span className="text-lg">
              {deletingBookId === book.id ? '⏳' : '🗑️'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}