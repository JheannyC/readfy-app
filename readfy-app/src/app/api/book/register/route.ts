import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StatusEnum } from "@prisma/client";

interface BookBody {
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  pages: number;
  imgURL?: string;
  rating?: number;
  status?: StatusEnum;
  currentPage?: number;
  notes?: string;
  isbn?: string;
}

function validateStringField(value: unknown, fieldName: string) {
  if (!value || typeof value !== "string" || !value.trim()) {
    return `${fieldName} é obrigatório e deve ser uma string válida.`;
  }
  return null;
}

function validateNumberField(value: unknown, fieldName: string) {
  if (typeof value !== "number" || isNaN(value) || value <= 0) {
    return `${fieldName} deve ser um número maior que zero.`;
  }
  return null;
}


export async function POST(request: NextRequest) {
  try {
    let body: BookBody;
    try {
      body = (await request.json()) as BookBody;
    } catch {
      return NextResponse.json(
        {
          error: "Corpo da requisição inválido.",
          details: "Não foi possível interpretar o JSON enviado.",
        },
        { status: 400 }
      );
    }

    const { title, author, genre, publicationYear, pages, imgURL } = body;

    const errors = [
      validateStringField(title, "Título do livro"),
      validateStringField(author, "Autor do livro"),
      validateStringField(genre, "Gênero do livro"),
      imgURL && typeof imgURL !== "string" ? "URL da imagem inválida." : null,
      validateNumberField(publicationYear, "Ano de publicação"),
      validateNumberField(pages, "Número de páginas"),
    ].filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    const genreNormalized = genre.toLowerCase().trim();
    let genreExistente = await prisma.genre.findUnique({
      where: { categoryName: genreNormalized },
    });
    if (!genreExistente) {
      genreExistente = await prisma.genre.create({
        data: { categoryName: genreNormalized },
      });
    }

    const validStatuses = Object.values(StatusEnum);
    const statusValue = validStatuses.includes(body.status as StatusEnum)
      ? (body.status as StatusEnum)
      : StatusEnum.Fechado;

    let statusExistente = await prisma.status.findUnique({
      where: { statusName: statusValue },
    });
    if (!statusExistente) {
      statusExistente = await prisma.status.create({
        data: { statusName: statusValue },
      });
    }

    const livro = await prisma.book.create({
      data: {
        title: title.trim(),
        author: author.trim(),
        publicationYear,
        pages,
        genre: { connect: { id: genreExistente.id } },
        status: { connect: { id: statusExistente.id } },
        rating: typeof body.rating === "number" ? body.rating : 0,
        imgURL: imgURL?.trim() || "",
        currentPage:
          typeof body.currentPage === "number" ? body.currentPage : 0,
        notes: body.notes?.trim() || "",
        isbn: body.isbn?.trim() || "",
        createdAt: new Date(),
      },
      include: { genre: true, status: true },
    });

    return NextResponse.json(
      {
        message: "Livro registrado com sucesso!",
        livro: {
          id: livro.id,
          title: livro.title,
          author: livro.author,
          genre: livro.genre?.categoryName,
          publicationYear: livro.publicationYear,
          pages: livro.pages,
          status: livro.status.statusName,
          rating: livro.rating,
          imgURL: livro.imgURL,
          currentPage: livro.currentPage,
          notes: livro.notes,
          isbn: livro.isbn,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar livro:", error);
    return NextResponse.json(
      {
        error: "Não foi possível registrar o livro.",
        details: "Ocorreu um erro interno no servidor.",
      },
      { status: 500 }
    );
  } finally {
    if (prisma) await prisma.$disconnect();
  }
}
