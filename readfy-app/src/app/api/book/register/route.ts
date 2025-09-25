import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, autor, genero, anoPublicacao, paginas } = body;

    if (!titulo || typeof titulo !== "string") {
      return Response.json({ error: "Título do livro é obrigatório." }, { status: 400 });
    }
    if (!titulo || typeof titulo !== "string") {
      return Response.json({ error: "Título do livro é obrigatório." }, { status: 400 });
    }
    if (!autor || typeof autor !== "string") {
      return Response.json({ error: "Autor do livro é obrigatório." }, { status: 400 });
    }
    if (!genero || typeof genero !== "string") {
      return Response.json({ error: "Gênero do livro é obrigatório." }, { status: 400 });
    }
    if (!anoPublicacao || typeof anoPublicacao !== "number" || anoPublicacao <= 0) {
      return Response.json({ error: "Ano de publicação inválido." }, { status: 400 });
    }
    if (!paginas || typeof paginas !== "number" || paginas <= 0) {
      return Response.json({ error: "Número de páginas inválido." }, { status: 400 });
    }

    const livro = await prisma.book.create({
      data: {
        titulo,
        autor,
        genero,
        anoPublicacao,
        paginas,
        status: "fechado",
        avaliacao: 0,
      },
    });

    


    return Response.json({ message: "Livro registrado com sucesso!", livro }, { status: 201 });
  } catch (error: any) {
    return Response.json(
      { error: "Não foi possível registrar o livro.", details: "O corpo da requisição não pôde ser interpretado. Verifique a formatação." },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
