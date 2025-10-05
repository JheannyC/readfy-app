"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/app/types/book";
import { DashboardResponse } from "@/app/types/dashboard";
import { toast } from "react-toastify";
import { ArrowRight, LayoutDashboard, RefreshCw } from "lucide-react";
import SkeletonStat from "../components/SkeletonStat";

export default function Dashboard() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
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
      toast.error("Erro ao carregar estatísticas");
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

  const clearSearch = () => {
    setSearchTerm("");
    const url = new URL(window.location.href);
    url.searchParams.delete("search");
    router.push(url.toString());
  };

  const handleReload = () => {
    setDashboardError(null);
    loadDashboard();
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-background transition-colors duration-300">
      <div className="h-16 shrink-0" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-foreground">
                <LayoutDashboard
                  className="inline-block w-8 h-8 mr-2"
                />
                Dashboard de Livros
              </h1>
              <button
                onClick={handleReload}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Recarregar"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <p className="text-muted-foreground">Gerencie sua biblioteca pessoal</p>
          </div>

          {/* Mensagem de erro */}
          {dashboardError && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-destructive">Erro ao carregar estatísticas</h3>
                  <p className="text-sm text-muted-foreground mt-1">{dashboardError}</p>
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

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {loadingDashboard || !dashboardData ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonStat key={i} />)
            ) : (
              <>
                <div className="bg-card p-4 rounded-lg shadow-sm border border-border transition-all hover:shadow-md">
                  <div className="text-2xl font-bold text-foreground">
                    {dashboardData.totalLivrosRegistrados ?? 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total de livros</div>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm border border-border transition-all hover:shadow-md">
                  <div className="text-2xl font-bold text-foreground">
                    {dashboardData.livrosNaoIniciados ?? 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Não iniciados</div>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm border border-border transition-all hover:shadow-md">
                  <div className="text-2xl font-bold text-foreground">
                    {dashboardData.livrosAbertos ?? 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Leitura em andamento
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm border border-border transition-all hover:shadow-md">
                  <div className="text-2xl font-bold text-foreground">
                    {dashboardData.livrosFinalizados ?? 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Leitura finalizada
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm border border-border transition-all hover:shadow-md">
                  <div className="text-2xl font-bold text-foreground">
                    {dashboardData.totalPaginasLidas ?? 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total de páginas lidas
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Botão para livros */}
          <button
            onClick={() => router.push("/v1/books")}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-all cursor-pointer shadow-sm"
          >
            Livros Cadastrados
            <ArrowRight size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}
