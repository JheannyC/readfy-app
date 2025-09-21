import { Book, createBook } from "@/app/types/book";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body: Book = await request.json();
    const newBook: Book = createBook(
      body.titulo,
      body.autor,
      body.genero,
      body.anoPublicacao,
      body.paginas,
      body.status,
      body.avaliacao
    );

    const filePath = path.join(process.cwd(), "data", "books.json");

    const data = await fs.readFile(filePath, "utf-8");
    const books: Book[] = JSON.parse(data);

    books.push(newBook);

    await fs.writeFile(filePath, JSON.stringify(books, null, 2));

    if (newBook.titulo === "" || typeof newBook.titulo !== "string") {
      return Response.json(
        {
          error: "Título do livro é obrigatório.",
          details: "Erro ao registrar livro. O título contém um valor inválido ou vazio.",
        },
        { status: 400 }
      );
    }
    if (newBook.autor === "" || typeof newBook.autor != "string") {
      return Response.json(
        {
          error: "Nome do autor é obrigatório.",
          details: "Erro ao registrar livro. O nome do autor contém um valor inválido ou vazio.",
        },
        { status: 400 }
      );
    }
    if (newBook.genero === "" || typeof newBook.genero != "string") {
      return Response.json(
        {
          error: "Gênero do livro é obrigatório.",
          details: "Erro ao registrar livro. O gênero do livro contém um valor inválido ou vazio.",
        },
        { status: 400 }
      );
    }

    if (
      newBook.anoPublicacao === undefined ||
      newBook.anoPublicacao <= 0 ||
      typeof newBook.anoPublicacao != "number"
    ) {
      return Response.json(
        {
          error: "Ano de publicação é obrigatório.",
          details: "Erro ao registrar livro. O ano de publicação contém um valor inválido ou vazio.",
        },
        { status: 400 }
      );
    }
    if (
      newBook.paginas === undefined ||
      newBook.paginas <= 0 ||
      typeof newBook.paginas != "number"
    ) {
      return Response.json(
        {
          error: "Quantidade de páginas é obrigatório.",
          details: "Erro ao registrar livro. A quantidade de páginas contém um valor inválido ou vazio.",
        },
        { status: 400 }
      );
    }

    return Response.json({
      message: "Livro registrado com sucesso!",
      livro: newBook,
    });
  } catch (error: any) {
    return Response.json(
      { error: "Não foi possível registrar o livro.", 
        details: "Revise os dados enviados no body da request. Algum campo pode não ter sido preenchido corretamente ou a formatação está incorreta."
      },
      { status: 500 }
    );
  }
}
