import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Book } from "@prisma/client";

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const livroId = Number(id);

    if (!Number.isInteger(livroId) || livroId <= 0) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const livro:
      | (Book & {
          genero: { categoryName: string } | null;
          status: { statusName: string } | null;
        })
      | null = await prisma.book.findUnique({
      where: { id: livroId },
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
          genero: livro.genero?.categoryName ?? null,
          anoPublicacao: livro.anoPublicacao,
          paginas: livro.paginas,
          status: livro.status?.statusName ?? null,
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
