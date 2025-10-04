"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Book, BookBody } from "@/app/types/book";
import { StatusEnum } from "@prisma/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [book, setBook] = useState<Book | null>(null);

  const [formData, setFormData] = useState<BookBody>({
    titulo: "",
    autor: "",
    genero: "",
    anoPublicacao: undefined,
    paginas: undefined,
    status: StatusEnum.Fechado,
    avaliacao: undefined,
    imgURL: undefined,
  });

  // Carregar livro pelo ID
  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/book/${bookId}`);
        if (!res.ok) throw new Error("Erro ao carregar livro");

        const data = await res.json();
        console.log("Livro recebido da API:", data);

        const currentBook = data.livro;
        if (!currentBook) {
          toast.error("Livro não encontrado!");
          router.push("/frontend/dashboard");
          return;
        }

        setBook(currentBook);
        setFormData({
          titulo: currentBook.titulo || "",
          autor: currentBook.autor || "",
          genero: currentBook.genero || "",
          anoPublicacao: currentBook.anoPublicacao || undefined,
          paginas: currentBook.paginas || undefined,
          status: (currentBook.status as StatusEnum) || StatusEnum.Fechado,
          avaliacao: currentBook.avaliacao ?? undefined,
          imgURL: currentBook.imgURL ?? undefined,
        });
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar livro");
        router.push("/frontend/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) loadBook();
  }, [bookId, router]);

  // Atualizar formData ao digitar
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "anoPublicacao" || name === "paginas" || name === "avaliacao"
          ? parseInt(value)
          : name === "status"
          ? (value as StatusEnum)
          : value,
    }));
  };

  // Detecta alterações para habilitar botão
  const isChanged = useMemo(() => {
    if (!book) return false;
    return (
      formData.titulo !== book.titulo ||
      formData.autor !== book.autor ||
      formData.genero !== book.genero ||
      formData.anoPublicacao !== book.anoPublicacao ||
      formData.paginas !== book.paginas ||
      formData.status !== book.status ||
      formData.avaliacao !== book.avaliacao ||
      formData.imgURL !== (book.imgURL ?? "")
    );
  }, [formData, book]);

  // Salvar alterações
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.autor || !formData.genero) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/book/update/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao atualizar livro");
      }

      toast.success("Livro atualizado com sucesso!");
      setTimeout(() => router.push("/frontend/books"), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar livro: " + err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );

  if (!book)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Livro não encontrado
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-500 hover:text-blue-600"
        >
          ← Voltar
        </button>
        <h1 className="text-3xl font-bold mb-2">Editar Livro</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 space-y-6"
        >
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Autor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Autor *
            </label>
            <input
              type="text"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Gênero */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gênero *
            </label>
            <input
              type="text"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Ano e Páginas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano de Publicação *
              </label>
              <input
                type="number"
                name="anoPublicacao"
                value={formData.anoPublicacao ?? ""}
                onChange={handleChange}
                required
                min={1000}
                max={2099}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Páginas *
              </label>
              <input
                type="number"
                name="paginas"
                value={formData.paginas ?? ""}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status de Leitura *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value={StatusEnum.Fechado}>📚 Quero Ler</option>
              <option value={StatusEnum.Aberto}>📖 Lendo</option>
              <option value={StatusEnum.Finalizado}>✅ Lido</option>
            </select>
          </div>

          {/* Avaliação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avaliação
            </label>
            <select
              name="avaliacao"
              value={formData.avaliacao ?? 0}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value={0}>Sem avaliação</option>
              <option value={1}>⭐ (1 estrela)</option>
              <option value={2}>⭐⭐ (2 estrelas)</option>
              <option value={3}>⭐⭐⭐ (3 estrelas)</option>
              <option value={4}>⭐⭐⭐⭐ (4 estrelas)</option>
              <option value={5}>⭐⭐⭐⭐⭐ (5 estrelas)</option>
            </select>
          </div>

          {/* URL da Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Imagem
            </label>
            <input
              type="text"
              name="imgURL"
              value={formData.imgURL ?? ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              disabled={saving}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !isChanged}
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {saving ? "⏳ Salvando..." : "💾 Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
