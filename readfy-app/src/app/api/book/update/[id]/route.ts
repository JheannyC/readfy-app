// src/app/api/books/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
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
    } = body as Record<string, any>;

    // validações apenas para campos enviados (edição parcial)
    if (titulo !== undefined && (typeof titulo !== "string" || titulo.trim() === "")) {
      return NextResponse.json({ error: "Título inválido." }, { status: 400 });
    }
    if (autor !== undefined && (typeof autor !== "string" || autor.trim() === "")) {
      return NextResponse.json({ error: "Autor inválido." }, { status: 400 });
    }
    if (anoPublicacao !== undefined && (typeof anoPublicacao !== "number" || anoPublicacao <= 0)) {
      return NextResponse.json({ error: "Ano de publicação inválido." }, { status: 400 });
    }
    if (paginas !== undefined && (typeof paginas !== "number" || paginas <= 0)) {
      return NextResponse.json({ error: "Número de páginas inválido." }, { status: 400 });
    }
    if (avaliacao !== undefined && (typeof avaliacao !== "number" || avaliacao < 0 || avaliacao > 5)) {
      return NextResponse.json({ error: "Avaliação deve ser número entre 0 e 5." }, { status: 400 });
    }

    // verifica se o livro existe
    const livroExistente = await prisma.book.findUnique({ where: { id } });
    if (!livroExistente) {
      return NextResponse.json({ error: "Livro não encontrado." }, { status: 404 });
    }

    // trata status (apenas se foi enviado)
    let statusExistente = null;
    if (status !== undefined) {
      if (typeof status !== "string") {
        return NextResponse.json({ error: "Status inválido." }, { status: 400 });
      }
      const allowed = ["aberto", "fechado", "finalizado"];
      if (!allowed.map(s => s.toLowerCase()).includes(status.toLowerCase())) {
        return NextResponse.json(
          { error: "Status inválido. Deve ser 'aberto', 'fechado' ou 'finalizado'." },
          { status: 400 }
        );
      }

      statusExistente = await prisma.status.findUnique({ where: { statusName: status } });
      if (!statusExistente) {
        statusExistente = await prisma.status.create({ data: { statusName: status } });
      }
    }

    // trata genero (apenas se foi enviado)
    let generoExistente = null;
    if (genero !== undefined) {
      if (typeof genero !== "string" || genero.trim() === "") {
        return NextResponse.json({ error: "Gênero inválido." }, { status: 400 });
      }
      generoExistente = await prisma.gender.findUnique({ where: { categoryName: genero } });
      if (!generoExistente) {
        generoExistente = await prisma.gender.create({ data: { categoryName: genero.toLowerCase() } });
      }
    }

    // monta updateData apenas com os campos enviados
    const updateData: any = {};
    if (titulo !== undefined) updateData.titulo = titulo;
    if (autor !== undefined) updateData.autor = autor;
    if (anoPublicacao !== undefined) updateData.anoPublicacao = anoPublicacao;
    if (paginas !== undefined) updateData.paginas = paginas;
    if (avaliacao !== undefined) updateData.avaliacao = avaliacao;

    // se status/genero foram tratados como relações no schema, conecte-os
    if (statusExistente) updateData.status = { connect: { id: statusExistente.id } };
    if (generoExistente) updateData.genero = { connect: { id: generoExistente.id } };

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar." }, { status: 400 });
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
          status: livroAtualizado.status?.statusName ?? livroAtualizado.status,
          avaliacao: livroAtualizado.avaliacao,
          genero: livroAtualizado.genero?.categoryName ?? null,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar livro.", details: "Revise os dados enviados no body da request. Algum campo pode não ter sido preenchido corretamente ou a formatação está incorreta." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
