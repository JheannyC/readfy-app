import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, autor, genero, anoPublicacao, paginas, imgURL } = body;

    if (!titulo || typeof titulo !== "string") {
      return Response.json(
        { error: "Título do livro é obrigatório." },
        { status: 400 }
      );
    }
    if (!titulo || typeof titulo !== "string") {
      return Response.json(
        { error: "Título do livro é obrigatório." },
        { status: 400 }
      );
    }
    if (!autor || typeof autor !== "string") {
      return Response.json(
        { error: "Autor do livro é obrigatório." },
        { status: 400 }
      );
    }
     if (!genero || genero !== undefined) {
      if (typeof genero !== "string" || !genero.trim()) {
        return Response.json(
          { error: "Gênero do livro é obrigatório." },
          { status: 400 }
        );
      }
    }
    if (imgURL && typeof imgURL !== "string") {
      return Response.json(
        { error: "URL da imagem inválida." },
        { status: 400 }
      );
    }
    if (
      !anoPublicacao ||
      typeof anoPublicacao !== "number" ||
      anoPublicacao <= 0
    ) {
      return Response.json(
        { error: "Ano de publicação inválido." },
        { status: 400 }
      );
    }
    if (!paginas || typeof paginas !== "number" || paginas <= 0) {
      return Response.json(
        { error: "Número de páginas inválido." },
        { status: 400 }
      );
    }

    let generoNormalized = genero.toLowerCase().trim();

    let generoExistente = await prisma.genre.findUnique({
      where: { categoryName: generoNormalized},
    });

    if (!generoExistente) {
      generoExistente = await prisma.genre.create({
        data: { categoryName: generoNormalized },
      });
    }

    let statusExistente = await prisma.status.findUnique({
      where: { statusName: "fechado" },
    });

    if (!statusExistente) {
      statusExistente = await prisma.status.create({
        data: { statusName: "fechado" },
      });
    }

    const livro = await prisma.book.create({
      data: {
        titulo,
        autor,
        anoPublicacao,
        paginas,
        status: {
          connect: { id: statusExistente.id },
        },
        genero: {
          connect: { id: generoExistente.id },
        },
        avaliacao: 0,
        imgURL: "",
        createdAt: new Date(),
      },
      include: {
        genero: true,
        status: true,
      },
    });

    return Response.json(
      {
        message: "Livro registrado com sucesso!",
        livro: {
          id: livro.id,
          titulo: livro.titulo,
          autor: livro.autor,
          genero: livro.genero?.categoryName,
          anoPublicacao: livro.anoPublicacao,
          paginas: livro.paginas,
          status: livro?.status?.statusName.toLowerCase(),
          avaliacao: livro.avaliacao,
          imgURL: livro.imgURL,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        error: "Não foi possível registrar o livro.",
        details:
          "O corpo da requisição não pôde ser interpretado. Verifique a formatação.",
      },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
