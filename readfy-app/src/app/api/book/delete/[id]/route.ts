import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const livro = await prisma.book.findUnique({
      where: { id },
      include: { genero: true, status: true },
    });
    if (!livro)
      return Response.json(
        {
          error: "Livro não encontrado.",
          details:
            "Revise o ID do livro. Talvez ele não exista, esteja incorreto ou não foi passado corretamente na URL.",
        },
        { status: 404 }
      );

    await prisma.book.delete({
      where: { id },
    });

    return Response.json({
      message: "Livro excluído com sucesso!",
    });
  } catch (error: any) {
    return Response.json(
      {
        error: "Erro ao excluir livro",
        details:
          "Revise o ID do livro. Talvez ele não exista, esteja incorreto ou não foi passado corretamente na URL.",
      },
      { status: 500 }
    );
  }
}
