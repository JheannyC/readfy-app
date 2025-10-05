"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Image,
  Plus,
  PlusCircle,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { StatusEnum } from "@prisma/client";
import FormField from "../../components/FormField";
import SelectField from "../../components/SelectField";
import { BookFormData, FieldError } from "@/app/types/error";

export default function RegisterBook() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
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

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imagemUrl: "", imagemFile: null }));
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateFieldSync = (
    field: keyof BookFormData,
    value: string
  ): string | null => {
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
          return "O autor deve ter entre 2 e 150 caracteres.";
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
        if (value.length > 6) value = value.slice(0, 6);
        const pages = Number(value);
        if (value.trim() === "" || isNaN(pages) || pages < 0)
          return "Páginas deve ser maior ou igual a 0.";
        break;
      case "currentPage":
        const currentPage = Number(value);
        const totalPages = Number(formData.paginas);
        if (value.trim() === "" || isNaN(currentPage) || currentPage < 0)
          return "Página atual deve ser maior que 0.";
        if (totalPages && currentPage > totalPages)
          return "Não pode ser maior que o número de páginas.";
        break;
      case "notes":
        if (value.length > 250)
          return "Notas e observações podem ter no máximo 250 caracteres.";
        break;
      case "imagemUrl":
        if (value.trim() !== "") {
          try {
            new URL(value); // tenta construir uma URL válida
            const isImage = /\.(jpeg|jpg|png|gif|webp|avif)$/i.test(value);
            if (!isImage)
              return "A URL deve apontar para uma imagem (.jpg, .png, .gif, .webp, .avif).";
          } catch {
            return "Informe uma URL válida (ex: https://exemplo.com/imagem.jpg)";
          }
        }
        break;
      default:
        return null;
    }
    return null;
  };

  const handleInputChange = <K extends keyof BookFormData>(
    field: K,
    value: string
  ) => {
    if (field === "isbn") {
      value = value.replace(/[^\d]/g, "");
      if (value.length > 3 && value.length <= 13)
        value = value.slice(0, 3) + "-" + value.slice(3);
      else if (value.length > 13)
        value = value.slice(0, 3) + "-" + value.slice(3, 13);
    }
    if (["anoPublicacao", "paginas", "currentPage"].includes(field)) {
      const maxLengthMap: Record<string, number> = {
        anoPublicacao: 4,
        paginas: 6,
        currentPage: 6,
      };
      value = value.slice(0, maxLengthMap[field]);
    }
    if (field === "notes") value = value.slice(0, 250);

    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateFieldSync(field, value);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newErrors: FieldError = {};
    (Object.keys(formData) as (keyof BookFormData)[]).forEach((field) => {
      const error = validateFieldSync(field, formData[field] as string);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    setLoading(false);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Verifique os campos.");
      return;
    }

    setLoading(true);
    try {
      const book = {
        title: formData.titulo.trim(),
        author: formData.autor.trim(),
        genre: formData.genero.trim(),
        publicationYear: Number(formData.anoPublicacao),
        pages: Number(formData.paginas),
        status: formData.status as StatusEnum,
        rating: formData.avaliacao ? Number(formData.avaliacao) : undefined,
        isbn: formData.isbn.trim() || undefined,
        currentPage: formData.currentPage
          ? Number(formData.currentPage)
          : undefined,
        notes: formData.notes.trim() || undefined,
        imgURL: formData.imagemUrl || previewUrl || undefined,
      };
      const response = await fetch("/api/book/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
      if (response.ok) {
        toast.success("📚 Livro cadastrado com sucesso!");
        router.push("/v1/books");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao cadastrar livro");
      }
    } catch {
      toast.error("Erro de conexão. Verifique se o servidor está executando.");
    } finally {
      setLoading(false);
    }
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 font-medium">Salvando Livro...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="h-16 shrink-0" />
      <main className="flex-1 overflow-y-auto p-6">
      {loading && <LoadingOverlay />}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/v1/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="inline-block w-5 h-5 mr-2" /> Voltar
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">
            <Plus
              className="inline-block w-8 h-8 mr-2"
              color="var(--color-icon)"
            />
            Cadastrar novo livro
          </h1>
          <p className="text-gray-600 mt-2">
            Preencha as informações do livro para adicionar à sua biblioteca
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className={`bg-white shadow-lg rounded-lg p-6 space-y-6 ${
            loading ? "opacity-70 pointer-events-none" : ""
          }`}
        >
          <div className="border-b border-gray-200 pb-6">
            {/* Capa do Livro */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Capa do livro
              </h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-40 h-48 flex-shrink-0 border rounded-lg overflow-hidden bg-gray-100 relative flex items-center justify-center">
                  {formData.imagemFile ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <span className="flex flex-col items-center justify-center text-gray-400 text-sm px-2 h-full">
                      <Image className="w-6 h-6 mb-1" />
                      Sem imagem
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <label className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer font-medium w-max text-center">
                    <UploadCloud className="inline-flex mr-2" size={16} />
                    Escolher arquivo
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-500">
                    Formatos: JPG, JPEG, PNG. Tamanho máximo: 5MB
                  </span>

                  <input
                    type="text"
                    value={formData.imagemUrl}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        imagemUrl: value,
                        imagemFile: null,
                      }));
                      setPreviewUrl("");
                      const error = validateFieldSync("imagemUrl", value);
                      setErrors((prev) => ({
                        ...prev,
                        imagemUrl: error || undefined,
                      }));
                    }}
                    placeholder="Ou cole a URL da imagem"
                    disabled={!!formData.imagemFile}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      formData.imagemFile
                        ? "bg-gray-100 cursor-not-allowed"
                        : errors.imagemUrl
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500 border-gray-300"
                    }`}
                  />
                  {errors.imagemUrl && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.imagemUrl}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 pb-6">
            <FormField
              label="Título do livro"
              type="text"
              value={formData.titulo}
              onChange={(v) => handleInputChange("titulo", v)}
              placeholder="Ex: Dom Casmurro"
              fieldName="titulo"
              errors={errors}
              maxLength={100}
              required={true}
            />
            <FormField
              label="Nome do autor"
              type="text"
              value={formData.autor}
              onChange={(v) => handleInputChange("autor", v)}
              fieldName="autor"
              errors={errors}
              maxLength={150}
              placeholder="Ex: Machado de Assis"
              required={true}
            />
            <FormField
              label="Gênero"
              type="text"
              value={formData.genero}
              onChange={(v) => handleInputChange("genero", v)}
              fieldName="genero"
              errors={errors}
              maxLength={100}
              placeholder="Ex: Ficção"
              required={true}
            />
            <FormField
              label="ISBN"
              type="text"
              value={formData.isbn}
              onChange={(v) => handleInputChange("isbn", v)}
              fieldName="isbn"
              errors={errors}
              maxLength={17}
              placeholder="Ex: 978-3-16-148410-0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 pb-6">
            <FormField
              label="Ano de publicação"
              type="number"
              value={formData.anoPublicacao}
              onChange={(v) => handleInputChange("anoPublicacao", v)}
              fieldName="anoPublicacao"
              errors={errors}
              min={1}
              max={new Date().getFullYear()}
              placeholder="Ex: 1899"
              required={true}
            />
            <FormField
              label="Número de páginas"
              type="number"
              value={formData.paginas}
              onChange={(v) => handleInputChange("paginas", v)}
              fieldName="paginas"
              errors={errors}
              placeholder="Ex: 200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 pb-6">
            <SelectField
              label="Status de leitura"
              value={formData.status}
              onChange={(v) => handleInputChange("status", v)}
              fieldName="status"
              errors={errors}
              options={[
                { value: StatusEnum.Fechado, label: "Não lido" },
                { value: StatusEnum.Aberto, label: "Lendo" },
                { value: StatusEnum.Finalizado, label: "Finalizado" },
              ]}
              required={true}
            />
            <SelectField
              label="Avaliação"
              value={formData.avaliacao}
              onChange={(v) => handleInputChange("avaliacao", v)}
              fieldName="avaliacao"
              errors={errors}
              options={[
                { value: "0", label: "Sem avaliação" },
                { value: "1", label: "⭐ - Péssimo" },
                { value: "2", label: "⭐⭐ - Ruim" },
                { value: "3", label: "⭐⭐⭐ - Regular" },
                { value: "4", label: "⭐⭐⭐⭐ - Bom" },
                { value: "5", label: "⭐⭐⭐⭐⭐ - Excelente" },
              ]}
            />
          </div>

          <FormField
            label="Página atual (página lida atualmente):"
            type="number"
            value={formData.currentPage}
            onChange={(v) => handleInputChange("currentPage", v)}
            fieldName="currentPage"
            placeholder="Ex: 50"
            errors={errors}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas e/ou observações
            </label>
            <textarea
              value={formData.notes}
              placeholder="Adicione notas sobre o livro..."
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={4}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                errors.notes
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/v1/dashboard"
              className="flex-1 bg-gray-500 text-white text-center py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : "Cadastrar livro"}
            </button>
          </div>
        </form>
      </div>
      </main>
    </div>
  );
}
