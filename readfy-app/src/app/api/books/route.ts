import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("📚 Buscando livros...");
    
    const { searchParams } = new URL(request.url);
    const generoParam = searchParams.get("name")?.toLowerCase().trim();

    // Buscar gêneros
    const generos = await prisma.genre.findMany({
      orderBy: { categoryName: "asc" },
    });

    let livros = [];
    
    // Buscar livros com filtro opcional
    if (generoParam) {
      livros = await prisma.book.findMany({
        where: {
          genre: {
            categoryName: { 
              contains: generoParam, 
              mode: "insensitive" 
            },
          },
        },
        include: { 
          genre: true, 
          status: true 
        },
        orderBy: { title: "asc" },
      });
    } else {
      livros = await prisma.book.findMany({
        include: { 
          genre: true, 
          status: true 
        },
        orderBy: { title: "asc" },
      });
    }

    console.log(`✅ Encontrados ${livros.length} livros`);

    return NextResponse.json(
      {
        message: livros.length > 0 
          ? "Livros encontrados com sucesso!" 
          : "Nenhum livro cadastrado.",
        totalGeneros: generos.length,
        generos: generos.map((g) => g.categoryName),
        totalLivros: livros.length,
        livros: livros.map((l) => ({
          id: l.id.toString(),
          title: l.title ?? "",
          author: l.author ?? "",
          genre: l.genre?.categoryName ?? "Sem gênero",
          publicationYear: l.publicationYear ?? 0,
          pages: l.pages ?? 0,
          status: l.status?.statusName ?? "Fechado",
          rating: l.rating ?? 0,
          currentPage: l.currentPage ?? 0,
          notes: l.notes ?? "",
          isbn: l.isbn ?? "",
          imgURL: l.imgURL ?? "",
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erro ao listar livros:", error);
    
    return NextResponse.json(
      {
        error: "Erro interno ao buscar livros.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
