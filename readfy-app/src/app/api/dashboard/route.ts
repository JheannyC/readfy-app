import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StatusEnum } from "@prisma/client";

export async function GET() {
  try {
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

    const totalLivrosRegistrados = await prisma.book.count();

    if (totalLivrosRegistrados === 0) {
      return NextResponse.json(
        {
          details:
            "Nenhum livro foi registrado. Adicione um livro para começar.",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({
        totalLivrosRegistrados,
        livrosNaoIniciados: fechado,
        livrosAbertos: aberto,
        livrosFinalizados: finalizados,
        totalPaginasLidas,
      });
    }
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
