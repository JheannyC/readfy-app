import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const generoParam = searchParams.get("name")?.toLowerCase().trim();

    const generos = await prisma.genre.findMany({
      orderBy: { categoryName: "asc" },
    });

    let livros = [];
    if (generoParam) {
      livros = await prisma.book.findMany({
        where: {
          genre: {
            categoryName: { contains: generoParam, mode: "insensitive" },
          },
        },
        include: { genre: true, status: true },
      });
    } else {
      livros = await prisma.book.findMany({
        include: { genre: true, status: true },
      });
    }

    return NextResponse.json(
      {
        totalGeneros: generos.length,
        generos: generos.map((g) => g.categoryName),
        totalLivros: livros.length,
        livros: livros.map((l) => ({
          id: l.id,
          title: l.title,
          author: l.author,
          genre: l.genre?.categoryName ?? null,
          publicationYear: l.publicationYear,
          pages: l.pages,
          status: l.status?.statusName ?? null,
          rating: l.rating,
          imgURL: l.imgURL,
          isbn: l.isbn,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao listar livros e gêneros:", error);
    return NextResponse.json(
      {
        error: "Erro ao listar livros e gêneros.",
        details: "Verifique se há dados no banco de dados.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
