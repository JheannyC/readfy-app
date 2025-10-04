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
          genero: {
            categoryName: { contains: generoParam, mode: "insensitive" },
          },
        },
        include: { genero: true, status: true },
      });
    } else {
      livros = await prisma.book.findMany({
        include: { genero: true, status: true },
      });
    }

    return NextResponse.json(
      {
        totalGeneros: generos.length,
        generos: generos.map((g) => g.categoryName),
        totalLivros: livros.length,
        livros: livros.map((l) => ({
          id: l.id,
          titulo: l.titulo,
          autor: l.autor,
          genero: l.genero?.categoryName ?? null,
          anoPublicacao: l.anoPublicacao,
          paginas: l.paginas,
          status: l.status?.statusName ?? null,
          avaliacao: l.avaliacao,
          imgURL: l.imgURL,
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
