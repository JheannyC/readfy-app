import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const livros = await prisma.book.findMany({
      include: { genero: true, status: true },
      orderBy: { titulo: "asc" },
    });

    return NextResponse.json({
      message: livros.length
        ? "Todos os livros foram listados com sucesso!"
        : "Nenhum livro cadastrado.",
      books: livros.map((l) => ({
        id: l.id,
        titulo: l.titulo,
        autor: l.autor,
        genero: l.genero?.categoryName ?? null,
        anoPublicacao: l.anoPublicacao,
        paginas: l.paginas,
        status: l.status?.statusName?.toUpperCase() ?? null,
        avaliacao: l.avaliacao,
      })),
    });
  } catch (error) {
    console.error("Erro ao listar todos os livros:", error);
    return NextResponse.json(
      {
        error: "Erro ao listar todos os livros.",
        details: "Ocorreu um erro interno ao acessar o banco de dados.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
