import { promises as fs } from "fs";
import path from "path";
import { Book } from "@/app/types/book";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "books.json");
    const data = await fs.readFile(filePath, "utf-8");
    const books: Book[] = JSON.parse(data);

    return Response.json({
      message: "Todos os livros foram listados com sucesso!",
      books,
    });
  } catch (error: any) {
    return Response.json(
      {
        error: "Erro ao listar todos os livros.",
        details:
          "Revise o arquivo data/books.json. Talvez ele esteja corrompido ou vazio.",
      },
      { status: 500 }
    );
  }
}
