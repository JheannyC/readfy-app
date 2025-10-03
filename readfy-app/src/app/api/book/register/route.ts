import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface BookBody {
  titulo: string;
  autor: string;
  genero: string;
  anoPublicacao: number;
  paginas: number;
  imgURL?: string;
}

function validateStringField(value: unknown, fieldName: string) {
  if (!value || typeof value !== "string" || !value.trim()) {
    return `${fieldName} é obrigatório e deve ser uma string válida.`;
  }
  return null;
}

function validateNumberField(value: unknown, fieldName: string) {
  if (typeof value !== "number" || value <= 0) {
    return `${fieldName} deve ser um número maior que zero.`;
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookBody;
    const { titulo, autor, genero, anoPublicacao, paginas, imgURL } = body;

    const errors = [
      validateStringField(titulo, "Título do livro"),
      validateStringField(autor, "Autor do livro"),
      validateStringField(genero, "Gênero do livro"),
      imgURL && typeof imgURL !== "string" ? "URL da imagem inválida." : null,
      validateNumberField(anoPublicacao, "Ano de publicação"),
      validateNumberField(paginas, "Número de páginas"),
    ].filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    // Normaliza e cria gênero se não existir
    const generoNormalized = genero.toLowerCase().trim();
    let generoExistente = await prisma.genre.findUnique({
      where: { categoryName: generoNormalized },
    });
    if (!generoExistente) {
      generoExistente = await prisma.genre.create({
        data: { categoryName: generoNormalized },
      });
    }

    // Status padrão "fechado"
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
        status: { connect: { id: statusExistente.id } },
        genero: { connect: { id: generoExistente.id } },
        avaliacao: 0,
        imgURL: imgURL || "",
        createdAt: new Date(),
      },
      include: { genero: true, status: true },
    });

    return NextResponse.json(
      {
        message: "Livro registrado com sucesso!",
        livro: {
          id: livro.id,
          titulo: livro.titulo,
          autor: livro.autor,
          genero: livro.genero?.categoryName,
          anoPublicacao: livro.anoPublicacao,
          paginas: livro.paginas,
          status: livro.status?.statusName.toLowerCase(),
          avaliacao: livro.avaliacao,
          imgURL: livro.imgURL,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar livro:", error);
    return NextResponse.json(
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
