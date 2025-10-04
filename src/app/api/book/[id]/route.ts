import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'books.json');

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;

    // Ler livros atuais
    const data = await fs.readFile(filePath, 'utf-8');
    const books = JSON.parse(data);

    // Encontrar e remover o livro
    const bookIndex = books.findIndex((book: any) => book.id === bookId);
    
    if (bookIndex === -1) {
      return Response.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    // Remover livro
    books.splice(bookIndex, 1);

    // Salvar arquivo atualizado
    await fs.writeFile(filePath, JSON.stringify(books, null, 2));

    return Response.json(
      { message: 'Livro excluído com sucesso' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}