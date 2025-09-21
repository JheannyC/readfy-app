import { v4 as uuidv4 } from "uuid";

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anoPublicacao: number;
  avaliacao: number;
  paginas: number;
  status: "fechado" | "aberto" | "finalizado";
}

export function createBook(
  titulo: string,
  autor: string,
  genero: string,
  anoPublicacao: number,
  paginas: number,
  status: "fechado" | "aberto" | "finalizado",
  avaliacao: number
): Book {
  return {
    id: uuidv4(),
    titulo,
    autor,
    genero,
    anoPublicacao,
    paginas,
    status: "fechado",
    avaliacao: 0,
  };
}
