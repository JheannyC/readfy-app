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
      return Response.json(
        {
          error: "Livro não encontrado.",
          details:
            "Revise o ID do livro. Talvez ele não exista, esteja incorreto ou não foi passado corretamente na URL.",
        },
        { status: 404 }
      );

    return Response.json({
      message: "Livro encontrado com sucesso!",
      livro,
    });
  } catch (error: any) {
    return Response.json(
      {
        error: "Erro ao retornar os dados do livro.",
        details:
          "Revise o ID do livro. Talvez ele não exista, esteja incorreto ou não foi passado corretamente na URL.",
      },
      { status: 500 }
    );
  }
}
