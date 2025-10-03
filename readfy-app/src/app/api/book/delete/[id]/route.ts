import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const livro = await prisma.book.findUnique({
      where: { id },
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

    await prisma.book.delete({ where: { id } });

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
