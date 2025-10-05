import { StatusEnum } from "@prisma/client";

export interface BookFormData {
  titulo: string;
  autor: string;
  genero: string;
  anoPublicacao: string;
  paginas: string;
  status: StatusEnum;
  avaliacao: string;
  isbn: string;
  currentPage: string;
  notes: string;
  imagemUrl: string;
  imagemFile: File | null;
}

export interface FieldError {
  [key: string]: string | undefined;
}
