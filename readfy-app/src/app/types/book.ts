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
  id: string,
  titulo: string,
  autor: string,
  genero: string,
  anoPublicacao: number,
  paginas: number,
  status: "fechado" | "aberto" | "finalizado",
  avaliacao: number
): Book {
  return {
    id,
    titulo,
    autor,
    genero,
    anoPublicacao,
    paginas,
    status,
    avaliacao,
  };
}
