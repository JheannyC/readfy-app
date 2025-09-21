import { promises as fs } from "fs";
import path from "path";
import { Book } from "@/app/types/book";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const filePath = path.join(process.cwd(), "data", "books.json");
    const data = await fs.readFile(filePath, "utf-8");
    const books: Book[] = JSON.parse(data);

    const livro = books.find((b) => b.id === id);
    if (!livro)
      return Response.json({ error: "Livro não encontrado" }, { status: 404 });

    return Response.json(livro);
  } catch (error: any) {
    return Response.json(
      { error: "Erro ao ler o livro", details: error.message },
      { status: 500 }
    );
  }
}
