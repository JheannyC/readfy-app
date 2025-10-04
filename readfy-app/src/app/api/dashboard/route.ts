import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StatusEnum } from "@prisma/client";

export async function GET() {
  try {
    const totalLivrosRegistrados = await prisma.book.count();

    if (totalLivrosRegistrados === 0) {
      return NextResponse.json(
        {
          totalLivrosRegistrados: 0,
          livrosNaoIniciados: 0,
          livrosAbertos: 0,
          livrosFinalizados: 0,
          totalPaginasLidas: 0,
          details:
            "Nenhum livro foi registrado. Adicione um livro para começar.",
        },
        { status: 200 }
      );
    }

    const aberto = await prisma.book.count({
      where: { status: { statusName: StatusEnum.Aberto } },
    });

    const fechado = await prisma.book.count({
      where: { status: { statusName: StatusEnum.Fechado } },
    });

    const finalizados = await prisma.book.count({
      where: { status: { statusName: StatusEnum.Finalizado } },
    });

    const paginasLidas = await prisma.book.aggregate({
      _sum: { paginas: true },
      where: { status: { statusName: StatusEnum.Finalizado } },
    });
    const totalPaginasLidas = paginasLidas._sum.paginas || 0;

    return NextResponse.json({
      totalLivrosRegistrados,
      livrosNaoIniciados: fechado,
      livrosAbertos: aberto,
      livrosFinalizados: finalizados,
      totalPaginasLidas,
    });
  } catch (error) {
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
