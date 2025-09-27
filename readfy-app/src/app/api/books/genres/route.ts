import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const generoParam = searchParams.get("name");

    const generos = await prisma.genre.findMany({
      orderBy: { categoryName: "asc" },
    });

    let livros = [];

    if (generoParam) {
      livros = await prisma.book.findMany({
        where: {
          genero: {
            categoryName: {
              equals: generoParam.toLowerCase().trim(),
              contains: generoParam.toLowerCase().trim(),
            },
          },
        },
        include: { genero: true, status: true },
      });
    } else {
      livros = await prisma.book.findMany({
        include: { genero: true, status: true },
      });
    }

    if (generos.length === 0) {
      return NextResponse.json(
        {
          message: "Nenhum gênero encontrado.",
        },
        { status: 404 }
      );
    }

    if (livros.length === 0) {
      return NextResponse.json(
        {
          message: `Nenhum livro encontrado para o gênero pesquisado: ${generoParam}.`,
        },
        { status: 404 }
      );
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
          genero: l.genero?.categoryName,
          anoPublicacao: l.anoPublicacao,
          paginas: l.paginas,
          status: l.status?.statusName,
          avaliacao: l.avaliacao,
          imgURL: l.imgURL,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
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
