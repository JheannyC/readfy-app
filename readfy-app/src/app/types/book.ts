import { v4 as uuidv4 } from "uuid";
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
  titulo: string,
  autor: string,
  genero: string,
  anoPublicacao: number,
  paginas: number,
  status: Status.fechado| Status.aberto | Status.finalizado,
  avaliacao: number
): Book {
  return {
    id: uuidv4(),
    titulo,
    autor,
    genero,
    anoPublicacao,
    paginas,
    status: Status.fechado,
    avaliacao: 0,
  };
}
