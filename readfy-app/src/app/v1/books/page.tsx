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
  RefreshCw,
} from "lucide-react";
import SkeletonCard from "@/app/v1/components/SkeletonCard";
import ConfirmDeleteModal from "@/app/v1/components/ConfirmDeleteModal";
import StarRating from "@/app/v1/components/StarRating";
import { getStatusColor } from "@/app/types/statusColor";
import Link from "next/link";

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoadingBooks(true);
        setError(null);
        
        const res = await fetch("/api/books");

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }

        const result = await res.json();

        if (result.livros) {
          setBooks(result.livros);
          setFilteredBooks(result.livros);
        } else {
          setBooks([]);
          setFilteredBooks([]);
        }
      } catch (err) {
        console.error("❌ Erro loadBooks:", err);
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        toast.error("Erro ao carregar livros: " + errorMessage);
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
          b.title.toLowerCase().includes(lower) ||
          b.author.toLowerCase().includes(lower) ||
          b.genre.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, books]);

  const handleReload = () => {
    setError(null);
    setLoadingBooks(true);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleDelete = async (bookId: string) => {
    try {
      setDeletingBookId(bookId);
      const res = await fetch(`/api/book/delete/${bookId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ${res.status}: ${errorText}`);
      }

      const json = await res.json();
      toast.success(json.message ?? "Livro excluído com sucesso!");
      setIsModalOpen(false);

      const updated = books.filter((b) => b.id !== bookId);
      setBooks(updated);
      setFilteredBooks(updated);
    } catch (err) {
      console.error("❌ Erro deletar:", err);
      toast.error("Erro ao excluir: " + String(err));
    } finally {
      setDeletingBookId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-background transition-colors duration-300">
      <div className="h-16 shrink-0" />

      <main className="flex-1 overflow-y-auto p-6">
        <Link
          href="/v1/dashboard"
          className="inline-flex items-center text-primary hover:opacity-80 mb-4 transition-colors"
        >
          <ArrowLeft className="inline-block w-5 h-5 mr-2" /> Voltar para Dashboard
        </Link>
        
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <LibraryBig className="w-8 h-8 mr-2 text-primary" />
                Livros Cadastrados
              </h1>
              <button
                onClick={handleReload}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Recarregar"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-destructive">Erro ao carregar livros</h3>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
                <button
                  onClick={handleReload}
                  className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}

          {/* === Se não há livros cadastrados === */}
          {!loadingBooks && !error && books.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg shadow-sm border transition-colors">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Nenhum livro na biblioteca
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Comece adicionando seu primeiro livro para organizar sua leitura.
              </p>
              <button
                onClick={() => router.push("/v1/book/register")}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium text-lg"
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
                    <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar por título, autor ou gênero..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {searchTerm && (
                    <div className="mt-2 text-sm text-muted-foreground">
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
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-card rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 p-6 flex flex-col cursor-pointer group"
                      onClick={() => router.push(`/v1/book/${book.id}`)}
                    >
                      {/* Capa */}
                      <div className="w-full aspect-[4/5] mb-3 overflow-hidden rounded-md bg-muted">
                        <img
                          src={book.imgURL || "/images/fallback-book.png"}
                          alt={`Capa do livro ${book.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src =
                              "/images/fallback-book.png")
                          }
                        />
                      </div>

                      {/* Header */}
                      <div className="flex justify-between items-start mb-4 flex-1">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                            {book.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
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
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Gênero:</span>
                          <span className="font-medium text-foreground">{book.genre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ano:</span>
                          <span className="font-medium text-foreground">
                            {book.publicationYear}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Páginas:</span>
                          <span className="font-medium text-foreground">{book.pages}</span>
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
                      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-border z-10 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/v1/book/update/${book.id}`);
                          }}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar livro"
                        >
                          <SquarePen className="w-5 h-5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
                          className="w-full flex items-center justify-center gap-2 text-primary font-medium hover:underline transition-colors"
                        >
                          Ver Mais <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  !error && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      Nenhum livro encontrado.
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
