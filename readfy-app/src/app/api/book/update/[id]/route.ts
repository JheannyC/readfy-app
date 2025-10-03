import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function validateString(value: any, fieldName: string) {
  if (value !== undefined && (typeof value !== "string" || !value.trim())) {
    return `${fieldName} inválido.`;
  }
  return null;
}

function validateNumber(value: any, fieldName: string, min = 1, max?: number) {
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
  const normalized = status.toUpperCase().trim();
  const allowed = ["ABERTO", "FECHADO", "FINALIZADO"];
  if (!allowed.includes(normalized)) throw new Error("Status inválido");

  let statusExistente = await prisma.status.findUnique({
    where: { statusName: normalized },
  });

  if (!statusExistente) {
    statusExistente = await prisma.status.create({
      data: { statusName: normalized },
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
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
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
    } = body as Record<string, any>;

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

    let statusExistente = null;
    if (status !== undefined) statusExistente = await getOrCreateStatus(status);

    let generoExistente = null;
    if (genero !== undefined) generoExistente = await getOrCreateGenero(genero);

    const updateData: any = {
      ...(titulo !== undefined && { titulo: titulo.trim() }),
      ...(autor !== undefined && { autor: autor.trim() }),
      ...(anoPublicacao !== undefined && { anoPublicacao }),
      ...(paginas !== undefined && { paginas }),
      ...(avaliacao !== undefined && { avaliacao }),
      ...(imgURL !== undefined && { imgURL }),
      ...(statusExistente && {
        status: { connect: { id: statusExistente.id } },
      }),
      ...(generoExistente && {
        genero: { connect: { id: generoExistente.id } },
      }),
    };

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo para atualizar." },
        { status: 400 }
      );
    }

    const livroAtualizado = await prisma.book.update({
      where: { id },
      data: updateData,
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
          status: livroAtualizado.status?.statusName ?? null,
          genero: livroAtualizado.genero?.categoryName ?? null,
          imgURL: livroAtualizado.imgURL,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao atualizar livro:", error);
    return NextResponse.json(
      {
        error: "Erro ao atualizar livro.",
        details:
          "Revise os dados enviados no body da request. Algum campo pode estar incorreto.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
