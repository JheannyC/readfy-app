import { StatusEnum } from "@prisma/client";

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anoPublicacao: number;
  avaliacao: number;
  paginas: number;
  status: StatusEnum;
  imgURL?: string;
}

export function createBook(
  id: string,
  titulo: string,
  autor: string,
  genero: string,
  anoPublicacao: number,
  paginas: number,
): Book {
  return {
    id,
    titulo,
    autor,
    genero,
    anoPublicacao,
    paginas,
    status: StatusEnum.Fechado,
    avaliacao: 0,
    imgURL: "",
  };
}

export interface BookBody {
  titulo?: string;
  autor?: string;
  genero?: string;
  anoPublicacao?: number;
  paginas?: number;
  status?: StatusEnum;
  avaliacao?: number;
  imgURL?: string;
}

