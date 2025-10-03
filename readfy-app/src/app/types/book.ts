import { Status } from "@/app/dashboard/enum/StatusEnum";

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anoPublicacao: number;
  avaliacao: number;
  paginas: number;
  status: Status.fechado| Status.aberto | Status.finalizado;
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
    status: Status.fechado,
    avaliacao: 0,
  };
}

export interface BookBody {
  titulo?: string;
  autor?: string;
  genero?: string;
  anoPublicacao?: number;
  paginas?: number;
  status?: "ABERTO" | "FECHADO" | "FINALIZADO";
  avaliacao?: number;
  imgURL?: string;
}

