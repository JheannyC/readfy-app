import { promises as fs } from "fs";
import path from "path";
import { Book } from "@/app/types/book";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const filePath = path.join(process.cwd(), "data", "books.json");
    const data = await fs.readFile(filePath, "utf-8");
    const books: Book[] = JSON.parse(data);

    const livroIndex = books.findIndex((b) => b.id === id);
    if (livroIndex === -1) return Response.json({ error: "Livro não encontrado" }, { status: 404 });

    books.splice(livroIndex, 1);

    await fs.writeFile(filePath, JSON.stringify(books, null, 2));

    return Response.json({
      message: "Livro excluído com sucesso!",
    });
  } catch (error: any) {
    return Response.json(
      { error: "Erro ao excluir livro", details: error.message },
      { status: 500 }
    );
  }
}
