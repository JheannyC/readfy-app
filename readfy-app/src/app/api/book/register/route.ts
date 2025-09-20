// app/api/books/adicionar/route.ts
import { Book, createBook } from "@/app/types/book";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body: Book = await request.json();
    const newBook: Book = createBook(body.titulo, body.autor, body.genero, body.anoPublicacao, body.paginas, body.status, body.avaliacao);

    const filePath = path.join(process.cwd(), "data", "books.json");

    const data = await fs.readFile(filePath, "utf-8");
    const books: Book[] = JSON.parse(data);

    books.push(newBook);

    await fs.writeFile(filePath, JSON.stringify(books, null, 2));

    return Response.json({
      message: "Livro adicionado com sucesso!",
      livro: newBook,
    });
  } catch (error: any) {
    return Response.json(
      { error: "Erro ao salvar livro", details: error.message },
      { status: 500 }
    );
  }
}
