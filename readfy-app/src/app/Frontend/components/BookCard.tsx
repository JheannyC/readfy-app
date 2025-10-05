"use client";

import { Book } from "@/app/types/book";
import { useRouter } from "next/navigation";
import { SquarePen, Trash } from "lucide-react";
import StarRating from "./StarRating";
import { getStatusColor } from "@/app/types/statusColor";

interface BookCardProps {
  book: Book;
  onDelete?: (bookId: string) => void;
  deletingBookId?: string | null;
}

export default function BookCard({ book, onDelete, deletingBookId }: BookCardProps) {
  const router = useRouter();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = "/images/fallback-book.png";
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col md:flex-row cursor-pointer group">
      {/* Capa */}
      <div className="w-full md:w-1/4 aspect-[3/4] overflow-hidden rounded-t-md md:rounded-l-md bg-gray-100 flex-shrink-0">
        <img
          src={book.imgURL || "/images/fallback-book.png"}
          alt={`Capa do livro ${book.title}`}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Título e status */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 mr-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-gray-600 mt-1">por {book.author}</p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              book.status
            )}`}
            title={book.status}
          >
            <span className="mr-1">{getStatusIcon(book.status)}</span>
            {book.status}
          </span>
        </div>

        {/* Informações do livro */}
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex justify-between"><span>Gênero:</span><span className="font-medium">{book.genre}</span></div>
          <div className="flex justify-between"><span>Ano:</span><span className="font-medium">{book.publicationYear}</span></div>
          <div className="flex justify-between"><span>Páginas:</span><span className="font-medium">{book.pages}</span></div>

          {book.rating !== undefined && (
            <div className="flex justify-between items-center">
              <span>Avaliação:</span>
              <StarRating
                bookId={Number(book.id)}
                initialRating={book.rating}
                onUpdate={() => {}}
              />
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/frontend/book/update/${book.id}`);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar livro"
          >
            <SquarePen className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(book.id);
            }}
            disabled={deletingBookId === book.id}
            className={`p-2 rounded-lg transition-colors ${
              deletingBookId === book.id
                ? "text-gray-300 cursor-not-allowed bg-gray-100"
                : "text-gray-400 hover:text-red-600 hover:bg-red-50"
            }`}
            title={deletingBookId === book.id ? "Excluindo..." : "Excluir livro"}
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
