import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📚 Sistema de Gerenciamento de Livros
          </h1>
          <p className="text-xl text-gray-600">
            Organize sua biblioteca pessoal de forma simples e eficiente
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            href="/frontend/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            📊 Acessar Dashboard
          </Link>
          
          <Link 
            href="/book/register"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            ➕ Cadastrar Novo Livro
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
            <h4 className="font-semibold mb-2">🔍 Busca Inteligente</h4>
            <p className="text-sm text-gray-600">Encontre livros por título, autor ou gênero</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
            <h4 className="font-semibold mb-2">📈 Estatísticas</h4>
            <p className="text-sm text-gray-600">Acompanhe seu progresso de leitura</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
            <h4 className="font-semibold mb-2">⚡ Rápido e Fácil</h4>
            <p className="text-sm text-gray-600">Interface simples e intuitiva</p>
          </div>
        </div>
      </div>
    </div>
  );
}