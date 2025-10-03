import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const livro = await prisma.book.findMany({
      include: { genero: true, status: true },
      orderBy: { titulo: "asc" },
    });

    if (livro.length === 0) {
      return Response.json(
        {
          message: "Nenhum livro cadastrado.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Todos os livros foram listados com sucesso!",
      books: livro.map((livro) => ({
        id: livro.id,
        titulo: livro.titulo,
        autor: livro.autor,
        genero: livro.genero?.categoryName,
        anoPublicacao: livro.anoPublicacao,
        paginas: livro.paginas,
        status: livro?.status?.statusName.toUpperCase(),
        avaliacao: livro.avaliacao,
      })),
    });
  } catch (error: any) {
    return Response.json(
      {
        error: "Erro ao listar todos os livros.",
        details: "Revise o arquivo. Talvez ele esteja corrompido ou vazio.",
      },
      { status: 500 }
    );
  }
}
