"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatusEnum } from "@prisma/client";
import { Book } from "@/app/types/book";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "@/app/frontend/components/ConfirmDeleteModal";
import StarRating from "@/app/frontend/components/StarRating";
import { SquarePen, Trash, Search, LibraryBig } from "lucide-react";
import SkeletonCard from "@/app/frontend/components/SkeletonCard"; // seu skeleton separado
import { getStatusColor } from "@/app/types/statusColor";

export default function Dashboard() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoadingBooks(true);
        const res = await fetch("/api/books");

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`${res.status} ${res.statusText} - ${text}`);
        }

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

  useEffect(() => {
    const lower = searchTerm.trim().toLowerCase();
    if (!lower) {
      setFilteredBooks(books);
      return;
    }
    setFilteredBooks(
      books.filter(
        (b) =>
          b.titulo.toLowerCase().includes(lower) ||
          b.autor.toLowerCase().includes(lower) ||
          b.genero.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, books]);

  const handleDelete = async (bookId: string) => {
    try {
      setDeletingBookId(bookId);
      const res = await fetch(`/api/book/delete/${bookId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText} - ${text}`);
      }

      const json = await res.json();
      toast.success(json.message ?? "Livro excluído com sucesso!");
      setIsModalOpen(false);

      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      setFilteredBooks((prev) => prev.filter((b) => b.id !== bookId));
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
      <button>Voltar</button>
      <main className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              <LibraryBig
                className="inline-block w-8 h-8 mr-2"
                color="var(--color-icon)"
              />
              Livros Cadastrados
            </h1>
          </div>

          {/* Busca */}
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

          {/* Grid de livros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingBooks ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col"
                >
                  {/* Capa */}
                  <div className="w-full aspect-[2/3] mb-4 overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={book.imgURL || "/images/fallback-book.png"}
                      alt={`Capa do livro ${book.titulo}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/fallback-book.png";
                      }}
                    />
                  </div>

                  {/* Header */}
                  <div className="flex justify-between items-start mb-4 flex-1">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {book.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        por {book.autor}
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
                      <span className="font-medium">{book.genero}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ano:</span>
                      <span className="font-medium">{book.anoPublicacao}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Páginas:</span>
                      <span className="font-medium">{book.paginas}</span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span>Avaliação:</span>
                      <StarRating
                        bookId={Number(book.id)}
                        initialRating={book.avaliacao ?? 0}
                      />
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={`/book/update/${book.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar livro"
                    >
                      <SquarePen className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir livro"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                    <ConfirmDeleteModal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      onConfirm={() => handleDelete(book.id)}
                      bookTitle={book.titulo}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg">
                  {searchTerm
                    ? "Nenhum livro encontrado."
                    : "Nenhum livro registrado."}
                </div>
                {!searchTerm && (
                  <button
                    onClick={() => router.push("/book/register")}
                    className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                  >
                    + Novo Livro
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
