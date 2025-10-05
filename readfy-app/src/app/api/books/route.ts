import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const livros = await prisma.book.findMany({
      include: { genre: true, status: true },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({
      message: livros.length
        ? "Todos os livros foram listados com sucesso!"
        : "Nenhum livro cadastrado.",
      books: livros.map((l) => ({
        id: l.id.toString(),
        title: l.title ?? "",
        author: l.author ?? "",
        genre: l.genre?.categoryName ?? "",
        publicationYear: l.publicationYear ?? 0,
        pages: l.pages ?? 0,
        status: l.status?.statusName,
        rating: l.rating ?? 0,
        currentPage: l.currentPage ?? 0,
        notes: l.notes ?? "",
        isbn: l.isbn ?? "",
        imgURL: l.imgURL ?? "",
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