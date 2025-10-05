"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Image,
  Pencil,
  UploadCloud,
  X,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { StatusEnum } from "@prisma/client";
import "react-toastify/dist/ReactToastify.css";
import { BookFormData, FieldError } from "@/app/types/error";

import SelectField from "../../../components/SelectField";
import FormField from "../../../components/FormField";
import BookFormSkeleton from "@/app/v1/components/SkeletonBookForm";

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

  // Carregar dados do livro
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
          router.push("/v1/dashboard");
          return;
        }

        setFormData({
          titulo: livro.title || "",
          autor: livro.author || "",
          genero: livro.genre || "",
          anoPublicacao: livro.publicationYear?.toString() || "",
          paginas: livro.pages?.toString() || "",
          status: (livro.status as StatusEnum) || StatusEnum.Fechado,
          avaliacao: livro.rating?.toString() || "0",
          isbn: livro.isbn || "",
          currentPage: livro.currentPage?.toString() || "",
          notes: livro.notes || "",
          imagemUrl: "", // não preenchemos a URL
          imagemFile: livro.imgURL ? ({} as File) : null, // placeholder para indicar que existe imagem
        });
        setPreviewUrl(livro.imgURL || "");
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar livro");
        router.push("/v1/dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (bookId) loadBook();
  }, [bookId, router]);

  // Upload e preview da imagem
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
    setPreviewUrl(""); // não mostra preview de URL
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imagemUrl: "", imagemFile: null }));
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Validações
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
        if (!value || isNaN(pages) || pages < 0)
          return "Número de páginas deve ser maior ou.";
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
      case "imagemUrl":
        if (value.trim() !== "") {
          try {
            new URL(value);
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
        currentPage: formData.currentPage
          ? Number(formData.currentPage)
          : undefined,
        notes: formData.notes.trim() || undefined,
        imgURL: formData.imagemFile
          ? previewUrl
          : formData.imagemUrl || undefined,
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
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar livro: " + err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <BookFormSkeleton />;

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-background transition-colors duration-300">
      <div className="h-16 shrink-0" />
      <main className="flex-1 overflow-y-auto p-6">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            {/* Voltar (usa o tema) */}
            <Link
              href="/v1/books"
              className="inline-flex items-center text-primary hover:opacity-80 mb-4 transition-colors"
            >
              <ArrowLeft className="inline-block w-5 h-5 mr-2" /> Voltar
            </Link>

            <h1 className="text-4xl font-bold text-foreground">
              <Pencil
                className="inline-block w-8 h-8 mr-2"
                color="var(--color-icon)"
              />{" "}
              Editar livro
            </h1>
            <p className="text-muted-foreground mt-2">Atualize as informações do livro</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card shadow-lg rounded-lg p-6 space-y-6 border border-border"
          >
            {/* Capa */}
            <div className="border-b border-border pb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Capa do livro
              </h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-40 h-48 flex-shrink-0 border rounded-lg overflow-hidden bg-muted relative flex items-center justify-center">
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
                        className="absolute top-1 right-1 bg-red-400 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:opacity-90 z-10"
                        title="Remover imagem"
                      >
                        <X className="w-3 h-3" color="white" />
                      </button>
                    </>
                  ) : previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:opacity-90 z-10"
                        title="Remover imagem"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <span className="flex flex-col items-center justify-center text-muted-foreground text-sm px-2 h-full">
                      <Image className="w-6 h-6 mb-1" />
                      Sem imagem
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  {/* Escolher arquivo (usa o tema) */}
                  <label
                    className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:brightness-90 cursor-pointer font-medium w-max text-center transition-all"
                  >
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

                  <span className="text-xs text-muted-foreground">
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
                        ? "bg-muted cursor-not-allowed border-border"
                        : errors.imagemUrl
                        ? "border-red-500 focus:ring-destructive"
                        : "focus:ring-primary border-input"
                    } transition-colors`}
                  />
                  {errors.imagemUrl && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.imagemUrl}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Campos principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border pb-6">
              <FormField
                label="Título"
                type="text"
                value={formData.titulo}
                onChange={(v) => handleInputChange("titulo", v)}
                fieldName="titulo"
                errors={errors}
                maxLength={100}
                placeholder="Ex: Dom Casmurro"
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

            {/* Publicação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border pb-6">
              <FormField
                label="Ano de publicação"
                type="number"
                value={formData.anoPublicacao}
                onChange={(v) => handleInputChange("anoPublicacao", v)}
                fieldName="anoPublicacao"
                errors={errors}
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
                required={true}
              />
            </div>

            {/* Status e avaliação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border pb-6">
              <SelectField
                label="Status"
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

            {/* Página atual e notas */}
            <FormField
              label="Página atual (página lida atualmente)"
              type="number"
              value={formData.currentPage}
              onChange={(v) => handleInputChange("currentPage", v)}
              fieldName="currentPage"
              errors={errors}
              placeholder="Ex: 50"
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notas e/ou observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={4}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                  errors.notes
                    ? "border-destructive focus:ring-destructive"
                    : "border-border focus:ring-primary"
                } transition-colors`}
                placeholder="Adicione notas sobre o livro..."
              />
              {errors.notes && (
                <p className="text-destructive text-sm mt-1">{errors.notes}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
              <Link
                href="/v1/dashboard"
                className="flex-1 bg-muted text-muted-foreground text-center py-3 rounded-lg hover:brightness-90 transition-all font-medium"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg hover:brightness-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
