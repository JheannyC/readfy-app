"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/app/types/book";
import { DashboardResponse } from "@/app/types/dashboard";
import { toast } from "react-toastify";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import SkeletonStat from "../components/SkeletonStat";

export default function Dashboard() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoadingDashboard(true);
      setDashboardError(null);

      const res = await fetch("/api/dashboard");
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText} - ${text}`);
      }
      const json: DashboardResponse = await res.json();
      setDashboardData(json);
    } catch (err) {
      console.error("Erro fetchDashboard:", err);
      setDashboardError(String(err));
    } finally {
      setLoadingDashboard(false);
    }
  };

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
    loadDashboard();
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

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="h-16 shrink-0" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              <LayoutDashboard className="inline-block w-8 h-8 mr-2" color="var(--color-icon)"/>
              Dashboard de Livros
            </h1>
            <p className="text-gray-600">Gerencie sua biblioteca pessoal</p>
          </div>
          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {loadingDashboard || !dashboardData ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonStat key={i} />)
            ) : (
              <>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardData.totalLivrosRegistrados ?? 0}
                  </div>
                  <div className="text-sm text-gray-600">Total de livros</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-500">
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardData.livrosNaoIniciados ?? 0}
                  </div>
                  <div className="text-sm text-gray-600">Não iniciados</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardData.livrosAbertos ?? 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    Leitura em andamento
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardData.livrosFinalizados ?? 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    Leitura finalizada
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-950">
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardData.totalPaginasLidas ?? 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total de páginas lidas
                  </div>
                </div>
              </>
            )}
          </div>

          {dashboardError && (
            <div className="mb-4 text-sm text-red-600">
              Erro ao carregar estatísticas:{" "}
              {loadingDashboard ? "…" : dashboardData?.details}
            </div>
          )}
          <button
            onClick={() => router.push("/frontend/books")}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all cursor-pointer"
          >
            Livros Cadastrados
            <ArrowRight size={18} className="text-white" />
          </button>
        </div>
      </main>
    </div>
  );
}
