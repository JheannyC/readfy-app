import Link from "next/link";
import { Plus, ChartLine, SquareKanban } from "lucide-react";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-16">
          <img
            src="/images/readfy.png"
            alt="Readfy"
            className="mx-auto h-60 w-auto mb-2"
          />
          <h2 className="text-3xl font-bold text-foreground mb-4">
            <SquareKanban
              size={36}
              className="inline-block mr-2"
            />
            Sistema de Gerenciamento de Livros
          </h2>
          <p className="text-2xl text-muted-foreground">
            Organize sua biblioteca pessoal de forma simples e eficiente
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/v1/dashboard"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md"
          >
            <ChartLine size={20} className="inline-block mr-2" />
            Acessar Dashboard
          </Link>

          <Link
            href="/v1/book/register"
            className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md"
          >
            <Plus size={20} className="inline-block mr-2" />
            Cadastrar Novo Livro
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 border shadow-sm transition-all hover:scale-105 hover:shadow-md">
            <h4 className="font-semibold mb-2 text-card-foreground">🔍 Busca Inteligente</h4>
            <p className="text-sm text-muted-foreground">
              Encontre livros por título, autor ou gênero
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 border shadow-sm transition-all hover:scale-105 hover:shadow-md">
            <h4 className="font-semibold mb-2 text-card-foreground">📈 Estatísticas</h4>
            <p className="text-sm text-muted-foreground">
              Acompanhe seu progresso de leitura
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 border shadow-sm transition-all hover:scale-105 hover:shadow-md">
            <h4 className="font-semibold mb-2 text-card-foreground">⚡ Rápido e Fácil</h4>
            <p className="text-sm text-muted-foreground">
              Interface simples e intuitiva
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
