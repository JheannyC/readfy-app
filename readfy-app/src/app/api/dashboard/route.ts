import { promises as fs } from "fs";
import path from "path";
import { Book } from "@/app/types/book";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "books.json");
    const data = await fs.readFile(filePath, "utf-8");
    const books: Book[] = JSON.parse(data);

    const lendo = books.filter((b: any) => b.status === "aberto").length;
    const finalizados = books.filter(
      (b: any) => b.status === "finalizado").length;
    const paginasLidas = books
      .filter((b: any) => b.status === "finalizado")
      .reduce((acc: number, b: any) => acc + (b.paginas || 0), 0);

    return Response.json({
      livrosLendo: lendo,
      livrosFinalizados: finalizados,
      totalPaginasLidas: paginasLidas,
      total: books.length,
    });
  } catch (error: any) {
    return Response.json(
      { error: "Erro ao gerar estatísticas", details: error.message },
      { status: 500 }
    );
  }
}
