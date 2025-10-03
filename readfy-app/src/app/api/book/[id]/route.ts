import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
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
      include: { genero: true, status: true },
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

    return NextResponse.json(
      {
        message: "Livro encontrado com sucesso!",
        livro: {
          id: livro.id,
          titulo: livro.titulo,
          autor: livro.autor,
          genero: livro.genero.categoryName,
          anoPublicacao: livro.anoPublicacao,
          paginas: livro.paginas,
          status: livro.status.statusName,
          avaliacao: livro.avaliacao,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar livro:", error);
    return NextResponse.json(
      {
        error: "Erro ao retornar os dados do livro.",
        details: "Ocorreu um erro interno no servidor.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
