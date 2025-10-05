import { StatusEnum } from "@prisma/client";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  pages: number;
  status: StatusEnum;
  rating: number;
  imgURL?: string;
  isbn?: string;
  currentPage?: number;
  notes?: string;
}

export interface BookBody {
  title?: string;
  author?: string;
  genre?: string;
  publicationYear?: number;
  pages?: number;
  status?: StatusEnum;
  rating?: number;
  imgURL?: string;
  isbn?: string;
  currentPage?: number;
  notes?: string;
}

export function createBook(
  id: string,
  title: string,
  author: string,
  genre: string,
  publicationYear: number,
  pages: number,
  status: string, // string que representa uma chave do enum
  rating: number,
  imgURL?: string,
  isbn?: string,
  currentPage?: number,
  notes?: string
): Book {
  const statusEnum: StatusEnum =
    StatusEnum[status as keyof typeof StatusEnum] || StatusEnum.Fechado;

  return {
    id,
    title,
    author,
    genre,
    publicationYear,
    pages,
    status: statusEnum ?? StatusEnum.Fechado,
    rating: rating ?? 0,
    imgURL: imgURL ?? "",
    isbn: isbn ?? "",
    currentPage: currentPage ?? 0,
    notes: notes ?? "",
  };
}
export function createBookFromBody(id: string, body: BookBody): Book {
  return createBook(
    id,
    body.title ?? "",
    body.author ?? "",
    body.genre ?? "",
    body.publicationYear ?? 0,
    body.pages ?? 0,
    body.status ?? StatusEnum.Fechado,
    body.rating ?? 0,
    body.imgURL,
    body.isbn,
    body.currentPage,
    body.notes
  );
}
