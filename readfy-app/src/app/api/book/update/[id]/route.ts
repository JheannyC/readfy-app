import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, StatusEnum } from "@prisma/client";

const prisma = new PrismaClient();

interface Params {
  id: string;
}

interface BookBody {
  titulo?: string;
  autor?: string;
  anoPublicacao?: number;
  paginas?: number;
  avaliacao?: number;
  imgURL?: string;
}

function validateString(value: string | undefined, fieldName: string) {
  if (value !== undefined && (typeof value !== "string" || !value.trim())) {
    return `${fieldName} inválido.`;
  }
  return null;
}

function validateNumber(
  value: number | undefined,
  fieldName: string,
  min = 1,
  max?: number
) {
  if (
    value !== undefined &&
    (typeof value !== "number" ||
      value < min ||
      (max !== undefined && value > max))
  ) {
    return `${fieldName} inválido.`;
  }
  return null;
}

async function getOrCreateStatus(status: string) {
  const normalized = status.trim();
  const allowed = ["Aberto", "Fechado", "Finalizado"];
  if (!allowed.includes(normalized)) throw new Error("Status inválido");

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

async function getOrCreateGenero(genero: string) {
  const normalized = genero.toLowerCase().trim();
  let generoExistente = await prisma.genre.findUnique({
    where: { categoryName: normalized },
  });

  if (!generoExistente) {
    generoExistente = await prisma.genre.create({
      data: { categoryName: normalized },
    });
  }
  return generoExistente;
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

    const body = await request.json();
    const {
      titulo,
      autor,
      genero,
      anoPublicacao,
      paginas,
      status,
      avaliacao,
      imgURL,
    } = body as BookBody & { status?: string; genero?: string };

    const errors = [
      validateString(titulo, "Título"),
      validateString(autor, "Autor"),
      validateString(genero, "Gênero"),
      validateNumber(anoPublicacao, "Ano de publicação"),
      validateNumber(paginas, "Número de páginas"),
      validateNumber(avaliacao, "Avaliação", 0, 5),
      imgURL !== undefined && typeof imgURL !== "string"
        ? "URL da imagem inválida."
        : null,
    ].filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    const livroExistente = await prisma.book.findUnique({ where: { id } });
    if (!livroExistente) {
      return NextResponse.json(
        { error: "Livro não encontrado." },
        { status: 404 }
      );
    }

    const statusExistente = status
      ? await getOrCreateStatus(status)
      : undefined;
    const generoExistente = genero
      ? await getOrCreateGenero(genero)
      : undefined;

    const updateData: Partial<BookBody> = {
      ...(titulo !== undefined && { titulo: titulo.trim() }),
      ...(autor !== undefined && { autor: autor.trim() }),
      ...(anoPublicacao !== undefined && { anoPublicacao }),
      ...(paginas !== undefined && { paginas }),
      ...(avaliacao !== undefined && { avaliacao }),
      ...(imgURL !== undefined && { imgURL }),
    };

    const relationalData: {
      status?: { connect: { id: number } };
      genero?: { connect: { id: number } };
    } = {
      ...(statusExistente && {
        status: { connect: { id: statusExistente.id } },
      }),
      ...(generoExistente && {
        genero: { connect: { id: generoExistente.id } },
      }),
    };

    if (
      Object.keys(updateData).length === 0 &&
      Object.keys(relationalData).length === 0
    ) {
      return NextResponse.json(
        { error: "Nenhum campo para atualizar." },
        { status: 400 }
      );
    }

    const livroAtualizado = await prisma.book.update({
      where: { id },
      data: { ...updateData, ...relationalData },
      include: { genero: true, status: true },
    });

    return NextResponse.json(
      {
        message: "Livro atualizado com sucesso!",
        livro: {
          id: livroAtualizado.id,
          titulo: livroAtualizado.titulo,
          autor: livroAtualizado.autor,
          anoPublicacao: livroAtualizado.anoPublicacao,
          paginas: livroAtualizado.paginas,
          avaliacao: livroAtualizado.avaliacao,
          status: livroAtualizado.status?.statusName?? null,
          genero: livroAtualizado.genero?.categoryName ?? null,
          imgURL: livroAtualizado.imgURL,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Erro ao atualizar livro:", error);
    // Checa se error é um Error para acessar message
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
