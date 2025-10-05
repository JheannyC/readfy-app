"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
        if (value.length > 6) value = value.slice(0, 6);
        const pages = Number(value);
        if (!value || isNaN(pages) || pages < 0)
          return "Número de páginas deve ser maior ou igual a 0.";
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
    if (field === "isbn") {
      value = value.replace(/[^\d]/g, "");
      if (value.length > 3 && value.length <= 13) value = value.slice(0, 3) + "-" + value.slice(3);
      else if (value.length > 13) value = value.slice(0, 3) + "-" + value.slice(3, 13);
    }
    if (["anoPublicacao", "paginas", "currentPage"].includes(field)) {
      const maxLengthMap: Record<string, number> = { anoPublicacao: 4, paginas: 6, currentPage: 6 };
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
      toast.error("Corrija os erros antes de enviar.");
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
        currentPage: formData.currentPage ? Number(formData.currentPage) : undefined,
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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/v1/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="inline-block w-5 h-5 mr-2" /> Voltar para Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Cadastrar Novo Livro</h1>
          <p className="text-muted-foreground mt-2">Preencha as informações do livro para adicionar à sua biblioteca</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card shadow-sm border border-border rounded-lg p-6">
          <div className="border-b border-border pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Capa do Livro</h2>
            {previewUrl && (
              <div className="mb-4">
                <div className="relative inline-block">
                  <img src={previewUrl} alt="Preview" className="w-32 h-48 object-cover rounded-lg shadow-md border border-border" />
                  <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90">
                    ✕
                  </button>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Upload da Imagem</label>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" 
              />
              <p className="text-xs text-muted-foreground mt-1">Formatos: JPG, PNG, GIF (máx 5MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border pb-6">
            <FormField label="Título *" type="text" value={formData.titulo} onChange={(v) => handleInputChange("titulo", v)} placeholder="Ex: Dom Casmurro" fieldName="titulo" errors={errors} maxLength={100} />
            <FormField label="Autor *" type="text" value={formData.autor} onChange={(v) => handleInputChange("autor", v)} fieldName="autor" errors={errors} maxLength={150} placeholder="Ex: Machado de Assis" />
            <FormField label="Gênero *" type="text" value={formData.genero} onChange={(v) => handleInputChange("genero", v)} fieldName="genero" errors={errors} maxLength={100} placeholder="Ex: Ficção" />
            <FormField label="ISBN" type="text" value={formData.isbn} onChange={(v) => handleInputChange("isbn", v)} fieldName="isbn" errors={errors} maxLength={17} placeholder="Ex: 978-3-16-148410-0" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border pb-6">
            <FormField label="Ano de Publicação *" type="number" value={formData.anoPublicacao} onChange={(v) => handleInputChange("anoPublicacao", v)} fieldName="anoPublicacao" errors={errors} min={1} max={new Date().getFullYear()} placeholder="Ex: 1899" />
            <FormField label="Número de Páginas *" type="number" value={formData.paginas} onChange={(v) => handleInputChange("paginas", v)} fieldName="paginas" errors={errors} placeholder="Ex: 200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border pb-6">
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

          <FormField label="Página Atual" type="number" value={formData.currentPage} onChange={(v) => handleInputChange("currentPage", v)} fieldName="currentPage" placeholder="Ex: 50" errors={errors} />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Notas e Observações</label>
            <textarea 
              value={formData.notes} 
              placeholder="Adicione notas sobre o livro..." 
              onChange={(e) => handleInputChange("notes", e.target.value)} 
              rows={4} 
              className={`w-full bg-background border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent resize-none text-foreground placeholder:text-muted-foreground ${
                errors.notes ? "border-destructive focus:ring-destructive" : "border-input focus:ring-primary"
              }`} 
            />
            {errors.notes && <p className="text-destructive text-sm mt-1">{errors.notes}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
            <Link href="/v1/dashboard" className="flex-1 bg-muted text-muted-foreground text-center py-3 rounded-lg hover:bg-muted/80 transition-colors font-medium">Cancelar</Link>
            <button type="submit" disabled={loading} className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Cadastrando..." : "Cadastrar Livro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}