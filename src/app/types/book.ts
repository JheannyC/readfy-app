export interface Book {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anoPublicacao: number;
  paginas: number;
  status: "Lido" | "Lendo" | "Quero Ler";
  avaliacao?: number;
  imagem?: string;
}

export function createBook(
  titulo: string,
  autor: string,
  genero: string,
  anoPublicacao: number,
  paginas: number,
  status: "Lido" | "Lendo" | "Quero Ler",
  avaliacao?: number,
  imagem?: string
): Book {
  return {
    id: Math.random().toString(36).substr(2, 9),
    titulo,
    autor,
    genero,
    anoPublicacao,
    paginas,
    status,
    avaliacao,
    imagem,
  };
}