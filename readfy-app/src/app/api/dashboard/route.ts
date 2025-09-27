import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: { genero: true, status: true },
    });

    const aberto = books.filter(
      (b: any) => b.status.statusName === "aberto"
    ).length;
    const fechado = books.filter(
      (b: any) => b.status.statusName === "fechado"
    ).length;
    const finalizados = books.filter(
      (b: any) => b.status.statusName === "finalizado"
    ).length;

    const paginasLidas = await prisma.book.aggregate({
      _sum: { paginas: true },
      where: { status: { statusName: "finalizado" } },
    });
    const totalPaginasLidas = paginasLidas._sum.paginas || 0;

    return Response.json({
      totalLivrosRegistrados: books.length,
      livrosNaoIniciados: fechado,
      livrosAbertos: aberto,
      livrosFinalizados: finalizados,
      totalPaginasLidas: totalPaginasLidas,
    });
  } catch (error: any) {
    return Response.json(
      {
        error: "Erro ao gerar estatísticas",
        details:
          "Revise os dados cadastrados. Talvez estejam corrompidos ou vazios.",
      },
      { status: 500 }
    );
  }
}
