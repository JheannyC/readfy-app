'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { StatusEnum } from "@prisma/client";
import "react-toastify/dist/ReactToastify.css";
import FormField from "../../components/FormField";
import SelectField from "../../components/SelectField";
import { BookFormData, FieldError } from "@/app/types/error";

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState<BookFormData>({
    titulo: "",
    autor: "",
    genero: "",
    anoPublicacao: "",
    paginas: "",
    status: StatusEnum.Fechado,
    avaliacao: "0",
    isbn: "",
    currentPage: "",
    notes: "",
    imagemUrl: "",
    imagemFile: null,
  });
  const [errors, setErrors] = useState<FieldError>({});

  // 📥 Carregar dados do livro
  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/book/${bookId}`);
        if (!res.ok) throw new Error("Erro ao carregar livro");
        const data = await res.json();
        const livro = data.livro;
        if (!livro) {
          toast.error("Livro não encontrado!");
          router.push("/frontend/dashboard");
          return;
        }

        setFormData({
          titulo: livro.title || "",
          autor: livro.author || "",
          genero: livro.genre || "",
          anoPublicacao: livro.publicationYear?.toString() || "",
          paginas: livro.pages?.toString() || "",
          status: livro.status as StatusEnum || StatusEnum.Fechado,
          avaliacao: livro.rating?.toString() || "0",
          isbn: livro.isbn || "",
          currentPage: livro.currentPage?.toString() || "",
          notes: livro.notes || "",
          imagemUrl: livro.imgURL || "",
          imagemFile: null,
        });
        setPreviewUrl(livro.imgURL || "");
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

  // 📸 Upload e preview da imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione apenas arquivos de imagem.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
    setFormData((prev) => ({ ...prev, imagemFile: file, imagemUrl: "" }));
  };

  const handleImageUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, imagemUrl: url, imagemFile: null }));
    setPreviewUrl(url);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imagemUrl: "", imagemFile: null }));
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 🔹 Validações
  const validateFieldSync = (field: keyof BookFormData, value: string): string | null => {
    const currentYear = new Date().getFullYear();
    switch (field) {
      case "titulo":
        if (value.trim().length < 2 || value.trim().length > 100)
          return "O título deve ter entre 2 e 100 caracteres.";
        break;
      case "genero":
        if (value.trim().length < 2 || value.trim().length > 50)
          return "O gênero deve ter entre 2 e 50 caracteres.";
        break;
      case "autor":
        if (value.trim().length < 2 || value.trim().length > 150)
          return "Nome do autor deve ter entre 2 e 150 caracteres.";
        break;
      case "isbn":
        if (value.length > 14) value = value.slice(0, 14);
        if (value && !/^\d{3}-\d{10}$/.test(value))
          return "ISBN deve seguir o padrão 978-XXXXXXXXXX.";
        break;
      case "anoPublicacao":
        const year = Number(value);
        if (value.length > 4) value = value.slice(0, 4);
        if (!value || isNaN(year) || year < 1 || year > currentYear)
          return `Ano deve ser entre 1 e ${currentYear}.`;
        break;
      case "paginas":
        const pages = Number(value);
        if (!value || isNaN(pages) || pages <= 0) return "Número de páginas deve ser maior que 0.";
        break;
      case "currentPage":
        const currentPage = Number(value);
        const totalPages = Number(formData.paginas);
        if (!value || isNaN(currentPage) || currentPage <= 0)
          return "Página atual deve ser maior que 0.";
        if (totalPages && currentPage > totalPages)
          return "Página atual não pode ser maior que o número de páginas.";
        break;
      case "notes":
        if (value.length > 250)
          return "Notas e observações podem ter no máximo 250 caracteres.";
        break;
      default:
        return null;
    }
    return null;
  };

  const handleInputChange = <K extends keyof BookFormData>(field: K, value: string) => {
    // Máscara de ISBN
    if (field === "isbn") {
      value = value.replace(/[^\d]/g, "");
      if (value.length > 3 && value.length <= 13) value = value.slice(0, 3) + "-" + value.slice(3);
      else if (value.length > 13) value = value.slice(0, 3) + "-" + value.slice(3, 13);
    }

    // Limitar campos numéricos
    if (["anoPublicacao", "paginas", "currentPage"].includes(field)) {
      const maxLengthMap: Record<string, number> = { anoPublicacao: 4, paginas: 6, currentPage: 6 };
      value = value.slice(0, maxLengthMap[field]);
    }

    // Limitar notas
    if (field === "notes") value = value.slice(0, 250);

    setFormData((prev) => ({ ...prev, [field]: value }));

    const error = validateFieldSync(field, value);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  // 🚀 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FieldError = {};
    (Object.keys(formData) as (keyof BookFormData)[]).forEach((field) => {
      const error = validateFieldSync(field, formData[field] as string);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Corrija os erros antes de salvar.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.titulo.trim(),
        author: formData.autor.trim(),
        genre: formData.genero.trim(),
        publicationYear: Number(formData.anoPublicacao),
        pages: Number(formData.paginas),
        status: formData.status,
        rating: Number(formData.avaliacao),
        isbn: formData.isbn.trim() || undefined,
        currentPage: formData.currentPage ? Number(formData.currentPage) : undefined,
        notes: formData.notes.trim() || undefined,
        imgURL: formData.imagemUrl || previewUrl || undefined,
      };

      const res = await fetch(`/api/book/update/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao atualizar livro");
      }

      toast.success("Livro atualizado com sucesso!");
      router.push("/frontend/books");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar livro: " + err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/frontend/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="inline-block w-5 h-5 mr-2" /> Voltar para Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Editar Livro</h1>
          <p className="text-gray-600 mt-2">
            Atualize as informações do livro
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          {/* Capa */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Capa do Livro</h2>
            {previewUrl && (
              <div className="mb-4">
                <div className="relative inline-block">
                  <img src={previewUrl} alt="Preview" className="w-32 h-48 object-cover rounded-lg shadow-md border" />
                  <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">✕</button>
                </div>
              </div>
            )}
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <input type="text" value={formData.imagemUrl} onChange={(e) => handleImageUrlChange(e.target.value)} placeholder="URL da imagem" className="w-full mt-2 border rounded-lg px-3 py-2" />
            </div>
          </div>

          {/* Campos principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 pb-6">
            <FormField label="Título *" type="text" value={formData.titulo} onChange={(v) => handleInputChange("titulo", v)} fieldName="titulo" errors={errors} maxLength={100} placeholder="Ex: Dom Casmurro" />
            <FormField label="Autor *" type="text" value={formData.autor} onChange={(v) => handleInputChange("autor", v)} fieldName="autor" errors={errors} maxLength={150} placeholder="Ex: Machado de Assis" />
            <FormField label="Gênero *" type="text" value={formData.genero} onChange={(v) => handleInputChange("genero", v)} fieldName="genero" errors={errors} maxLength={100} placeholder="Ex: Ficção" />
            <FormField label="ISBN" type="text" value={formData.isbn} onChange={(v) => handleInputChange("isbn", v)} fieldName="isbn" errors={errors} maxLength={17} placeholder="Ex: 978-3-16-148410-0" />
          </div>

          {/* Publicação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 pb-6">
            <FormField label="Ano de Publicação *" type="number" value={formData.anoPublicacao} onChange={(v) => handleInputChange("anoPublicacao", v)} fieldName="anoPublicacao" errors={errors} placeholder="Ex: 1899" />
            <FormField label="Número de Páginas *" type="number" value={formData.paginas} onChange={(v) => handleInputChange("paginas", v)} fieldName="paginas" errors={errors} placeholder="Ex: 200" />
          </div>

          {/* Status e avaliação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 pb-6">
            <SelectField label="Status *" value={formData.status} onChange={(v) => handleInputChange("status", v)} fieldName="status" errors={errors} options={[
              { value: StatusEnum.Fechado, label: "Não lido" },
              { value: StatusEnum.Aberto, label: "Lendo" },
              { value: StatusEnum.Finalizado, label: "Finalizado" },
            ]} />
            <SelectField label="Avaliação" value={formData.avaliacao} onChange={(v) => handleInputChange("avaliacao", v)} fieldName="avaliacao" errors={errors} options={[
              { value: "0", label: "Sem avaliação" },
              { value: "1", label: "⭐" },
              { value: "2", label: "⭐⭐" },
              { value: "3", label: "⭐⭐⭐" },
              { value: "4", label: "⭐⭐⭐⭐" },
              { value: "5", label: "⭐⭐⭐⭐⭐" },
            ]} />
          </div>

          {/* Página atual e notas */}
          <FormField label="Página Atual" type="number" value={formData.currentPage} onChange={(v) => handleInputChange("currentPage", v)} fieldName="currentPage" errors={errors} placeholder="Ex: 50" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notas e Observações</label>
            <textarea value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} rows={4} className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${errors.notes ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`} placeholder="Adicione notas sobre o livro..." />
            {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes}</p>}
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Link href="/frontend/dashboard" className="flex-1 bg-gray-500 text-white text-center py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium">Cancelar</Link>
            <button type="submit" disabled={saving} className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">{saving ? "Salvando..." : "Salvar Alterações"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
