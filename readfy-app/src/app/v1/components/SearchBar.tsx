"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // Se não estiver no dashboard, redireciona para o dashboard com o termo de busca
      if (pathname !== "/v1/dashboard") {
        router.push(`/v1/dashboard?search=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        // Se já estiver no dashboard, apenas atualiza a URL
        const url = new URL(window.location.href);
        url.searchParams.set('search', searchTerm.trim());
        router.push(url.toString());
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    // Remove o parâmetro de busca da URL
    if (pathname === "/v1/dashboard") {
      const url = new URL(window.location.href);
      url.searchParams.delete('search');
      router.push(url.toString());
    }
  };

  // Efeito para sincronizar com a URL quando a página carrega
  useEffect(() => {
    if (pathname === "/v1/dashboard") {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');
      if (searchParam) {
        setSearchTerm(searchParam);
      }
    }
  }, [pathname]);

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 Buscar livros por título, autor ou gênero..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        
        {/* Ícone de busca */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* Botão de limpar (aparece apenas quando há texto) */}
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}