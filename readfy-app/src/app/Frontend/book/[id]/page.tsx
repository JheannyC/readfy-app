"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Book } from "@/app/types/book";
import { toast } from "react-toastify";
import { ArrowLeft, LibraryBig, SquarePen, Trash } from "lucide-react";
import StarRating from "@/app/frontend/components/StarRating";
import { getStatusColor } from "@/app/types/statusColor";
import SkeletonBookCard from "@/app/frontend/components/SkeletonBookCard";
import SkeletonBookDetails from "@/app/frontend/components/SkeletonBookCard";
import Link from "next/link";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/book/${bookId}`);
        if (!res.ok) throw new Error("Erro ao carregar livro");
        const data = await res.json();
        if (!data.livro) {
          toast.error("Livro não encontrado");
          router.push("/frontend/books");
          return;
        }
        setBook({
          id: data.livro.id.toString(),
          title: data.livro.title,
          author: data.livro.author,
          genre: data.livro.genre ?? "",
          publicationYear: data.livro.publicationYear ?? 0,
          pages: data.livro.pages ?? 0,
          status: data.livro.status ?? "Quero Ler",
          rating: data.livro.rating ?? 0,
          currentPage: data.livro.currentPage ?? 0,
          notes: data.livro.notes ?? "",
          isbn: data.livro.isbn ?? "",
          imgURL: data.livro.imgURL ?? "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar livro");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId, router]);

  const handleDelete = async (id: string) => {
    setDeletingBookId(id);
    try {
      const res = await fetch(`/api/book/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir livro");
      toast.success("Livro excluído com sucesso!");
      router.push("/frontend/books");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir livro");
    } finally {
      setDeletingBookId(null);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
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

  if (loading) {
    return <SkeletonBookDetails />;
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        Livro não encontrado
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <main className="flex-1 overflow-y-auto p-6">
        <Link
          href="/frontend/books"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="inline-block w-5 h-5 mr-2" /> Voltar
        </Link>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <LibraryBig className="w-8 h-8 mr-2 text-blue-600" />
              Detalhes do Livro: {book.title}
            </h1>
          </div>

          {/* Card maior */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col md:flex-row p-6">
            {/* Capa do livro */}
            <div className="w-full md:w-1/3 bg-gray-100 rounded-t-md md:rounded-l-md overflow-hidden flex-shrink-0 min-h-[350px] flex items-center justify-center">
              <img
                src={book.imgURL || "/images/fallback-book.png"}
                alt={`Capa do livro ${book.title}`}
                className="max-w-full max-h-full object-contain"
                onError={handleImageError}
              />
            </div>

            {/* Informações do livro */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                {/* Título e status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 mr-4">
                    <h2 className="text-3xl font-bold text-gray-900 leading-snug">
                      {book.title}
                    </h2>
                    <p className="text-lg text-gray-700 mt-2 leading-relaxed">
                      por {book.author}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      book.status
                    )}`}
                    title={book.status}
                  >
                    <span className="mr-1">{getStatusIcon(book.status)}</span>
                    {book.status}
                  </span>
                </div>

                {/* Detalhes */}
                <div className="text-base text-gray-700 leading-relaxed space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Gênero:</span>
                    <span>{book.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ano:</span>
                    <span>{book.publicationYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Páginas:</span>
                    <span>{book.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Página atual:</span>
                    <span>{book.currentPage}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Avaliação:</span>
                    <StarRating
                      bookId={Number(book.id)}
                      initialRating={book.rating ?? 0}
                      onUpdate={() => {}}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">ISBN:</span>
                    <span>{book.isbn}</span>
                  </div>

                  {/* Notas */}
                  {book.notes && (
                    <div className="flex flex-col mt-2">
                      <span className="font-medium text-lg">Notas:</span>
                      <span className="text-base text-gray-700 leading-relaxed">
                        {book.notes}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() =>
                    router.push(`/frontend/book/update/${book.id}`)
                  }
                  className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar livro"
                >
                  <SquarePen className="w-6 h-6" />
                </button>

                <button
                  onClick={() => handleDelete(book.id)}
                  disabled={deletingBookId === book.id}
                  className={`p-3 rounded-lg transition-colors ${
                    deletingBookId === book.id
                      ? "text-gray-300 cursor-not-allowed bg-gray-100"
                      : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                  }`}
                  title={
                    deletingBookId === book.id
                      ? "Excluindo..."
                      : "Excluir livro"
                  }
                >
                  <Trash className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
