import { promises as fs } from "fs";
import path from "path";
import { Book } from "@/app/types/book";
import { Status } from "@/app/dashboard/enum/StatusEnum";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const filePath = path.join(process.cwd(), "data", "books.json");
    const data = await fs.readFile(filePath, "utf-8");
    let books: Book[] = JSON.parse(data);

    const index = books.findIndex((b) => b.id === id);
    if (index === -1) {
      return Response.json({ error: "Livro não encontrado." }, { status: 404 });
    }

    const { id: _, ...updateFields } = body;
    books[index] = { ...books[index], ...updateFields };

    await fs.writeFile(filePath, JSON.stringify(books, null, 2));

    if ("titulo" in updateFields) {
      if (
        updateFields.titulo === "" ||
        typeof updateFields.titulo !== "string"
      ) {
        return Response.json(
          {
            error: "Não foi possível atualizar o título.",
            details: "O título contém um valor inválido ou vazio.",
          },
          { status: 400 }
        );
      }
    }

    if ("autor" in updateFields) {
      if (updateFields.autor === "" || typeof updateFields.autor !== "string") {
        return Response.json(
          {
            error: "Não foi possível atualizar o autor.",
            details: "O autor contém um valor inválido ou vazio.",
          },
          { status: 400 }
        );
      }
    }

    if ("status" in updateFields) {
      if (
        ![Status.fechado, Status.aberto, Status.finalizado].includes(updateFields.status) ||
        typeof updateFields.status !== "string"
      ) {
        return Response.json(
          {
            error: "Não foi possível atualizar o status.",
            details: "O status deve ser 'Fechado', 'Aberto' ou 'Finalizado'.",
          },
          { status: 400 }
        );
      }
    }

    if ("avaliacao" in updateFields) {
      if (
        typeof updateFields.avaliacao !== "number" ||
        updateFields.avaliacao < 0 ||
        updateFields.avaliacao > 5
      ) {
        return Response.json(
          {
            error: "Não foi possível atualizar a avaliação.",
            details: "A avaliação deve ser um número entre 0 e 5.",
          },
          { status: 400 }
        );
      }
    }

    return Response.json({
      message: "Livro atualizado com sucesso!",
      book: books[index],
    });
  } catch (error: any) {
    return Response.json(
      {
        error: "Erro ao atualizar livro.",
        details:
          "Revise os dados enviados no body da request. Algum campo pode não ter sido preenchido corretamente ou a formatação está incorreta.",
      },
      { status: 500 }
    );
  }
}
