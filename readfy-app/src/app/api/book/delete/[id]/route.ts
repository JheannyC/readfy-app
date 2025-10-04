import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  id: string;
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const livroId = Number(id);

    if (!Number.isInteger(livroId) || livroId <= 0) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const livro = await prisma.book.findUnique({
      where: { id: livroId },
      select: { id: true },
    });

    if (!livro) {
      return NextResponse.json(
        {
          error: "Livro não encontrado.",
          details:
            "Verifique o ID do livro. Ele pode não existir ou ter sido passado incorretamente na URL.",
        },
        { status: 404 }
      );
    }

    await prisma.book.delete({ where: { id: livroId } });

    return NextResponse.json({
      message: "Livro excluído com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao excluir livro:", error);
    return NextResponse.json(
      {
        error: "Erro ao excluir livro.",
        details: "Ocorreu um erro interno no servidor.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
