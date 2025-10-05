"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/app/types/book";
import { toast } from "react-toastify";
import {
  Search,
  LibraryBig,
  ArrowRight,
  SquarePen,
  Trash,
  ArrowLeft,
} from "lucide-react";
import SkeletonCard from "@/app/v1/components/SkeletonCard";
import ConfirmDeleteModal from "@/app/v1/components/ConfirmDeleteModal";
import StarRating from "@/app/v1/components/StarRating";
import { getStatusColor } from "@/app/types/statusColor";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === Carregar livros ===
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoadingBooks(true);
        const res = await fetch("/api/books");
        if (!res.ok) throw new Error("Erro ao carregar livros");
        const result = await res.json();
        if (result.books) {
          setBooks(result.books);
          setFilteredBooks(result.books);
        }
      } catch (err) {
        console.error("Erro loadBooks:", err);
        toast.error("Erro ao carregar livros: " + err);
      } finally {
        setLoadingBooks(false);
      }
    };
    loadBooks();
  }, []);

  // === Filtro de busca ===
  useEffect(() => {
    const lower = searchTerm.trim().toLowerCase();
    if (!lower) {
      setFilteredBooks(books);
      return;
    }
    setFilteredBooks(
      books.filter(
        (b) =>
          b.title.toLowerCase().includes(lower) ||
          b.author.toLowerCase().includes(lower) ||
          b.genre.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, books]);

  // === Deletar livro ===
  const handleDelete = async (bookId: string) => {
    try {
      setDeletingBookId(bookId);
      const res = await fetch(`/api/book/delete/${bookId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir livro");
      const json = await res.json();
      toast.success(json.message ?? "Livro excluído com sucesso!");
      setIsModalOpen(false);

      const updated = books.filter((b) => b.id !== bookId);
      setBooks(updated);
      setFilteredBooks(updated);
    } catch (err) {
      console.error("Erro deletar:", err);
      toast.error("Erro ao excluir: " + String(err));
    } finally {
      setDeletingBookId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="h-16 shrink-0" />

      <main className="flex-1 overflow-y-auto p-6">
        <Link
          href="/v1/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="inline-block w-5 h-5 mr-2" /> Voltar para
          Dashboard
        </Link>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <LibraryBig className="w-8 h-8 mr-2 text-blue-600" />
              Livros Cadastrados
            </h1>
          </div>

          {/* === Se não há livros cadastrados === */}
          {!loadingBooks && books.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Nenhum livro na biblioteca
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Comece adicionando seu primeiro livro para organizar sua
                leitura.
              </p>
              <button
                onClick={() => router.push("/v1/book/register")}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
              >
                Cadastrar Primeiro Livro
                <ArrowRight className="pl-1 inline-block w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              {/* === Barra de busca === */}
              {books.length > 0 && (
                <div className="mb-6">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar por título, autor ou gênero..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {searchTerm && (
                    <div className="mt-2 text-sm text-gray-500">
                      {filteredBooks.length} resultado
                      {filteredBooks.length !== 1 ? "s" : ""} encontrado
                      {filteredBooks.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              )}

              {/* === Grid de livros === */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingBooks ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col cursor-pointer group"
                      onClick={() =>
                        router.push(`/v1/book/${book.id}`)
                      }
                    >
                      {/* Capa */}
                      <div className="w-full aspect-[4/5] mb-3 overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={book.imgURL || "/images/fallback-book.png"}
                          alt={`Capa do livro ${book.title}`}
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src =
                              "/images/fallback-book.png")
                          }
                        />
                      </div>

                      {/* Header */}
                      <div className="flex justify-between items-start mb-4 flex-1">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            por {book.author}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            book.status
                          )}`}
                        >
                          {book.status}
                        </span>
                      </div>

                      {/* Detalhes */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Gênero:</span>
                          <span className="font-medium">{book.genre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ano:</span>
                          <span className="font-medium">
                            {book.publicationYear}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Páginas:</span>
                          <span className="font-medium">{book.pages}</span>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <span>Avaliação:</span>
                          <StarRating
                            bookId={Number(book.id)}
                            initialRating={book.rating ?? 0}
                            onUpdate={(newRating) => {
                              setBooks((prev) =>
                                prev.map((b) =>
                                  b.id === book.id
                                    ? { ...b, rating: newRating }
                                    : b
                                )
                              );
                              setFilteredBooks((prev) =>
                                prev.map((b) =>
                                  b.id === book.id
                                    ? { ...b, rating: newRating }
                                    : b
                                )
                              );
                            }}
                          />
                        </div>
                      </div>

                      {/* Botões internos */}
                      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100 z-10 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/v1/book/update/${book.id}`);
                          }}
                          className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar livro"
                        >
                          <SquarePen className="w-5 h-5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir livro"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                        <ConfirmDeleteModal
                          isOpen={isModalOpen}
                          onClose={() => setIsModalOpen(false)}
                          onConfirm={() => handleDelete(book.id)}
                          bookTitle={book.title}
                        />
                      </div>

                      {/* Botão Ver Mais */}
                      <div className="mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/v1/book/${book.id}`);
                          }}
                          className="w-full flex items-center justify-center gap-2 text-blue-600 font-medium hover:underline transition-colors"
                        >
                          Ver Mais <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    Nenhum livro encontrado.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
