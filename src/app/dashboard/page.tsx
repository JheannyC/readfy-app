"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Book } from "@/app/types/book";
import BookCard from "../components/BookCard";

// Interface local para estatísticas
interface DashboardStats {
  totalLivros: number;
  livrosNaoLidos: number;
  livrosLendo: number;
  livrosLidos: number;
  totalPaginasLidas: number;
}

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    totalLivros: 0,
    livrosNaoLidos: 0,
    livrosLendo: 0,
    livrosLidos: 0,
    totalPaginasLidas: 0
  });
  const [loading, setLoading] = useState(true);
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);

  // Calcular estatísticas localmente
  const calculateStats = (books: Book[]): DashboardStats => {
    const livrosLidos = books.filter(book => book.status === 'Lido');
    
    return {
      totalLivros: books.length,
      livrosNaoLidos: books.filter(book => book.status === 'Quero Ler').length,
      livrosLendo: books.filter(book => book.status === 'Lendo').length,
      livrosLidos: livrosLidos.length,
      totalPaginasLidas: livrosLidos.reduce((total, book) => total + book.paginas, 0)
    };
  };

  // Carregar livros da API
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/books");

        if (!res.ok) {
          throw new Error("Erro ao carregar livros");
        }

        const booksData = await res.json();
        setBooks(booksData);
        setStats(calculateStats(booksData));
      } catch (err) {
        console.error("Erro loadBooks:", err);
        alert("Erro ao carregar livros: " + err);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  // Sincronizar busca da URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  // Filtrar livros baseado no termo de busca
  useEffect(() => {
    const lower = searchTerm.trim().toLowerCase();
    if (!lower) {
      setFilteredBooks(books);
      return;
    }
    
    const filtered = books.filter(
      (b) =>
        b.titulo.toLowerCase().includes(lower) ||
        b.autor.toLowerCase().includes(lower) ||
        b.genero.toLowerCase().includes(lower)
    );
    
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleDelete = async (bookId: string) => {
    if (!confirm("Tem certeza que deseja excluir este livro?")) return;
    try {
      setDeletingBookId(bookId);
      
      // Tentar deletar via API
      const res = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir livro");
      }

      // Atualizar lista localmente
      const updatedBooks = books.filter((b) => b.id !== bookId);
      setBooks(updatedBooks);
      setStats(calculateStats(updatedBooks));
      
      alert("Livro excluído com sucesso!");

    } catch (err) {
      console.error("Erro deletar:", err);
      // Fallback: excluir localmente mesmo se a API falhar
      const updatedBooks = books.filter((b) => b.id !== bookId);
      setBooks(updatedBooks);
      setStats(calculateStats(updatedBooks));
      alert("Livro excluído localmente!");
    } finally {
      setDeletingBookId(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    // Atualizar URL removendo o parâmetro de busca
    const url = new URL(window.location.href);
    url.searchParams.delete('search');
    router.push(url.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Carregando livros...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            📚 Dashboard de Livros
          </h1>
          <p className="text-gray-600">Gerencie sua biblioteca pessoal</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalLivros}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total de Livros</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-500 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-gray-900">
              {stats.livrosNaoLidos}
            </div>
            <div className="text-sm text-gray-600 mt-1">Quero Ler</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-gray-900">
              {stats.livrosLendo}
            </div>
            <div className="text-sm text-gray-600 mt-1">Lendo</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-gray-900">
              {stats.livrosLidos}
            </div>
            <div className="text-sm text-gray-600 mt-1">Lidos</div>
          </div>
        </div>

        {/* Estatística adicional - Páginas Lidas */}
        {stats.totalPaginasLidas > 0 && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500 max-w-md">
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalPaginasLidas.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Páginas Lidas no Total</div>
            </div>
          </div>
        )}

        {/* Indicador de busca (quando há busca ativa) */}
        {searchTerm && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-blue-900">
                  Buscando por: "{searchTerm}"
                </span>
                <span className="text-blue-700 text-sm ml-2">
                  ({filteredBooks.length} {filteredBooks.length === 1 ? 'resultado' : 'resultados'})
                </span>
              </div>
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Limpar busca
              </button>
            </div>
          </div>
        )}

        {/* Grid de livros */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {searchTerm ? 'Resultados da Busca' : 'Sua Biblioteca'} 
              ({filteredBooks.length} {filteredBooks.length === 1 ? 'livro' : 'livros'})
            </h2>
            <button
              onClick={() => router.push("/book/register")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              + Novo Livro
            </button>
          </div>

          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onDelete={handleDelete}
                  deletingBookId={deletingBookId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "Nenhum livro encontrado" : "Nenhum livro na biblioteca"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? "Tente ajustar os termos da busca ou limpar os filtros."
                  : "Comece adicionando seu primeiro livro para organizar sua leitura."
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push("/book/register")}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
                >
                  📖 Cadastrar Primeiro Livro
                </button>
              )}
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium text-lg"
                >
                  🗑️ Limpar Busca
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dica sobre imagens */}
        {books.length > 0 && !searchTerm && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-blue-500 text-lg mr-2">💡</span>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  Dica: Use a busca no header
                </h4>
                <p className="text-sm text-blue-800">
                  Você pode buscar livros por título, autor ou gênero diretamente 
                  na barra de busca no topo da página em qualquer momento!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}