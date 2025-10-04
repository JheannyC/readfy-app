"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Book } from "@/app/types/book";

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    genero: "",
    anoPublicacao: "",
    paginas: "",
    status: "Quero Ler" as "Lido" | "Lendo" | "Quero Ler",
    avaliacao: "0",
    imagem: ""
  });

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/books");
        
        if (!res.ok) {
          throw new Error("Erro ao carregar livros");
        }

        const books: Book[] = await res.json();
        const currentBook = books.find(b => b.id === bookId);
        
        if (!currentBook) {
          alert("Livro não encontrado!");
          router.push("/dashboard");
          return;
        }

        setBook(currentBook);
        setFormData({
          titulo: currentBook.titulo,
          autor: currentBook.autor,
          genero: currentBook.genero,
          anoPublicacao: currentBook.anoPublicacao.toString(),
          paginas: currentBook.paginas.toString(),
          status: currentBook.status,
          avaliacao: currentBook.avaliacao?.toString() || "0",
          imagem: currentBook.imagem || ""
        });
      } catch (err) {
        console.error("Erro ao carregar livro:", err);
        alert("Erro ao carregar livro: " + err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      loadBook();
    }
  }, [bookId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.autor.trim() || !formData.genero.trim()) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    if (!formData.anoPublicacao || !formData.paginas) {
      alert("Ano de publicação e número de páginas são obrigatórios!");
      return;
    }

    try {
      setSaving(true);
      
      // Carregar livros atuais
      const res = await fetch("/api/books");
      if (!res.ok) throw new Error("Erro ao carregar livros");
      
      const books: Book[] = await res.json();
      
      // Atualizar o livro específico
      const updatedBooks = books.map(b => 
        b.id === bookId 
          ? {
              ...b,
              titulo: formData.titulo.trim(),
              autor: formData.autor.trim(),
              genero: formData.genero.trim(),
              anoPublicacao: parseInt(formData.anoPublicacao),
              paginas: parseInt(formData.paginas),
              status: formData.status,
              avaliacao: formData.avaliacao === "0" ? undefined : parseInt(formData.avaliacao),
              imagem: formData.imagem.trim() || undefined
            }
          : b
      );

      // Enviar atualização para a API
      const updateRes = await fetch("/api/books", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBooks),
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        throw new Error(errorData.error || "Erro ao atualizar livro");
      }

      alert("Livro atualizado com sucesso!");
      router.push("/dashboard");
      
    } catch (err) {
      console.error("Erro ao atualizar livro:", err);
      alert("Erro ao atualizar livro: " + err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Livro não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-500 hover:text-blue-600 mb-4 font-medium"
          >
            ← Voltar para o Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Editar Livro</h1>
          <p className="text-gray-600">Atualize as informações do livro</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Digite o título do livro"
              />
            </div>

            {/* Autor */}
            <div>
              <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-2">
                Autor *
              </label>
              <input
                type="text"
                id="autor"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Digite o nome do autor"
              />
            </div>

            {/* Gênero */}
            <div>
              <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-2">
                Gênero *
              </label>
              <input
                type="text"
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Digite o gênero do livro"
              />
            </div>

            {/* Ano e Páginas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="anoPublicacao" className="block text-sm font-medium text-gray-700 mb-2">
                  Ano de Publicação *
                </label>
                <input
                  type="number"
                  id="anoPublicacao"
                  name="anoPublicacao"
                  value={formData.anoPublicacao}
                  onChange={handleChange}
                  required
                  min="1000"
                  max="2099"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="paginas" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Páginas *
                </label>
                <input
                  type="number"
                  id="paginas"
                  name="paginas"
                  value={formData.paginas}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status de Leitura *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="Quero Ler">📚 Quero Ler</option>
                <option value="Lendo">📖 Lendo</option>
                <option value="Lido">✅ Lido</option>
              </select>
            </div>

            {/* Avaliação */}
            <div>
              <label htmlFor="avaliacao" className="block text-sm font-medium text-gray-700 mb-2">
                Avaliação
              </label>
              <select
                id="avaliacao"
                name="avaliacao"
                value={formData.avaliacao}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="0">Sem avaliação</option>
                <option value="1">⭐ (1 estrela)</option>
                <option value="2">⭐⭐ (2 estrelas)</option>
                <option value="3">⭐⭐⭐ (3 estrelas)</option>
                <option value="4">⭐⭐⭐⭐ (4 estrelas)</option>
                <option value="5">⭐⭐⭐⭐⭐ (5 estrelas)</option>
              </select>
            </div>

            {/* Imagem */}
            <div>
              <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-2">
                URL da Imagem (opcional)
              </label>
              <input
                type="url"
                id="imagem"
                name="imagem"
                value={formData.imagem}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="https://exemplo.com/imagem-livro.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Cole a URL de uma imagem da capa do livro
              </p>
            </div>

            {/* Preview da Imagem */}
            {formData.imagem && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview da Imagem
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                  <img
                    src={formData.imagem}
                    alt="Preview da capa do livro"
                    className="max-h-48 mx-auto rounded shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const errorDiv = target.nextElementSibling as HTMLElement;
                      if (errorDiv) errorDiv.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-center text-gray-500 text-sm py-4">
                    ❌ Imagem não disponível ou URL inválida
                  </div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                disabled={saving}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {saving ? "⏳ Salvando..." : "💾 Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}