import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StatusEnum, Prisma } from "@prisma/client";

interface Params {
  id: string;
}

interface BookBody {
  title?: string;
  author?: string;
  genre?: string;
  publicationYear?: number;
  pages?: number;
  rating?: number;
  status?: StatusEnum | string;
  currentPage?: number;
  notes?: string;
  isbn?: string;
  imgURL?: string;
}

// Validação de string
function validateString(value: string | undefined, fieldName: string) {
  if (value !== undefined && (typeof value !== "string" || !value.trim())) {
    return `${fieldName} inválido.`;
  }
  return null;
}

// Validação de número
function validateNumber(
  value: number | undefined,
  fieldName: string,
  min = 1,
  max?: number
) {
  if (
    value !== undefined &&
    (typeof value !== "number" || value < min || (max !== undefined && value > max))
  ) {
    return `${fieldName} inválido.`;
  }
  return null;
}

// Cria ou retorna Status
async function getOrCreateStatus(status: string) {
  const normalized = status.trim();
  const allowed = Object.values(StatusEnum);
  if (!allowed.includes(normalized as StatusEnum)) throw new Error("Status inválido");

  let statusExistente = await prisma.status.findUnique({
    where: { statusName: normalized as StatusEnum },
  });

  if (!statusExistente) {
    statusExistente = await prisma.status.create({
      data: { statusName: normalized as StatusEnum },
    });
  }
  return statusExistente;
}

// Cria ou retorna Genre
async function getOrCreateGenre(genre: string) {
  const normalized = genre.toLowerCase().trim();
  let genreExistente = await prisma.genre.findUnique({
    where: { categoryName: normalized },
  });
  if (!genreExistente) {
    genreExistente = await prisma.genre.create({
      data: { categoryName: normalized },
    });
  }
  return genreExistente;
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr, 10);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    let body: BookBody;
    try {
      body = (await request.json()) as BookBody;
    } catch {
      return NextResponse.json(
        { error: "Corpo inválido.", details: "Não foi possível interpretar o JSON." },
        { status: 400 }
      );
    }

    const {
      title,
      author,
      genre,
      publicationYear,
      pages,
      rating,
      status,
      currentPage,
      notes,
      isbn,
      imgURL,
    } = body;

    // Validações individuais
    const errors = [
      validateString(title, "Título"),
      validateString(author, "Autor"),
      validateString(genre, "Gênero"),
      validateNumber(publicationYear, "Ano de publicação"),
      validateNumber(pages, "Número de páginas"),
      validateNumber(rating, "Avaliação", 0, 5),
      validateNumber(currentPage, "Página atual", 0, pages),
      imgURL !== undefined && typeof imgURL !== "string" ? "URL da imagem inválida." : null,
      isbn !== undefined && typeof isbn !== "string" ? "ISBN inválido." : null,
      notes !== undefined && typeof notes !== "string" ? "Notas inválidas." : null,
    ].filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    // Verifica se livro existe
    const livroExistente = await prisma.book.findUnique({ where: { id } });
    if (!livroExistente) {
      return NextResponse.json({ error: "Livro não encontrado." }, { status: 404 });
    }

    // Relacionamentos
    const relationalData: Prisma.BookUpdateInput = {};
    if (status) {
      const statusExistente = await getOrCreateStatus(status.toString());
      relationalData.status = { connect: { id: statusExistente.id } };
    }
    if (genre) {
      const genreExistente = await getOrCreateGenre(genre);
      relationalData.genre = { connect: { id: genreExistente.id } };
    }

    // Campos diretos
    const updateData: Prisma.BookUpdateInput = {};
    if (title !== undefined) updateData.title = title.trim();
    if (author !== undefined) updateData.author = author.trim();
    if (publicationYear !== undefined) updateData.publicationYear = publicationYear;
    if (pages !== undefined) updateData.pages = pages;
    if (rating !== undefined) updateData.rating = rating;
    if (currentPage !== undefined) updateData.currentPage = currentPage;
    if (notes !== undefined) updateData.notes = notes.trim();
    if (isbn !== undefined) updateData.isbn = isbn.trim();
    if (imgURL !== undefined) updateData.imgURL = imgURL.trim();

    if (Object.keys(updateData).length === 0 && Object.keys(relationalData).length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar." }, { status: 400 });
    }

    const livroAtualizado = await prisma.book.update({
      where: { id },
      data: { ...updateData, ...relationalData },
      include: { genre: true, status: true },
    });

    return NextResponse.json({
      message: "Livro atualizado com sucesso!",
      livro: {
        id: livroAtualizado.id,
        title: livroAtualizado.title,
        author: livroAtualizado.author,
        genre: livroAtualizado.genre?.categoryName ?? null,
        publicationYear: livroAtualizado.publicationYear,
        pages: livroAtualizado.pages,
        status: livroAtualizado.status?.statusName ?? null,
        rating: livroAtualizado.rating,
        currentPage: livroAtualizado.currentPage,
        notes: livroAtualizado.notes,
        isbn: livroAtualizado.isbn,
        imgURL: livroAtualizado.imgURL,
      },
    });
  } catch (error: unknown) {
    console.error("Erro ao atualizar livro:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Erro ao atualizar livro.",
        details: `Revise os dados enviados no body da request. Detalhes: ${message}`,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
