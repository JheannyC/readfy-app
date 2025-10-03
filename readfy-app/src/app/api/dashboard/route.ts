import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const aberto = await prisma.book.count({
      where: { status: { statusName: "aberto" } },
    });
    const fechado = await prisma.book.count({
      where: { status: { statusName: "fechado" } },
    });
    const finalizados = await prisma.book.count({
      where: { status: { statusName: "finalizado" } },
    });

    const paginasLidas = await prisma.book.aggregate({
      _sum: { paginas: true },
      where: { status: { statusName: "finalizado" } },
    });
    const totalPaginasLidas = paginasLidas._sum.paginas || 0;

    const totalLivrosRegistrados = await prisma.book.count();

    return NextResponse.json({
      totalLivrosRegistrados,
      livrosNaoIniciados: fechado,
      livrosAbertos: aberto,
      livrosFinalizados: finalizados,
      totalPaginasLidas,
    });
  } catch (error) {
    console.error("Erro ao gerar estatísticas:", error);
    return NextResponse.json(
      {
        error: "Erro ao gerar estatísticas",
        details:
          "Revise os dados cadastrados. Talvez estejam corrompidos ou vazios.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
