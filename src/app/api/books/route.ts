import { Book, createBook } from "@/app/types/book";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "books.json");

// Garantir que o diretório data existe
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Inicializar arquivo se não existir
async function initializeBooksFile() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify([], null, 2));
  }
}

// Carregar livros do arquivo
async function loadBooks(): Promise<Book[]> {
  await ensureDataDirectory();
  await initializeBooksFile();
  
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

// Salvar livros no arquivo
async function saveBooks(books: Book[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(books, null, 2));
}

export async function GET() {
  try {
    const books = await loadBooks();
    return Response.json(books);
  } catch (error) {
    console.error("Erro ao carregar livros:", error);
    return Response.json(
      { error: "Não foi possível carregar os livros." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validações
    if (!body.titulo || body.titulo.trim() === "" || typeof body.titulo !== "string") {
      return Response.json(
        {
          error: "Título do livro é obrigatório.",
          details: "Erro ao registrar livro. O título contém um valor inválido ou vazio.",
        },
        { status: 400 }
      );
    }
    
    if (!body.autor || body.autor.trim() === "" || typeof body.autor !== "string") {
      return Response.json(
        {
          error: "Nome do autor é obrigatório.",
          details: "Erro ao registrar livro. O nome do autor contém um valor inválido ou vazio.",
        },
        { status: 400 }
      );
    }
    
    if (!body.genero || body.genero.trim() === "" || typeof body.genero !== "string") {
      return Response.json(
        {
          error: "Gênero do livro é obrigatório.",
          details: "Erro ao registrar livro. O gênero do livro contém um valor inválido ou vazio.",
        },
        { status: 400 }
      );
    }

    if (!body.anoPublicacao || body.anoPublicacao <= 0 || typeof body.anoPublicacao !== "number") {
      return Response.json(
        {
          error: "Ano de publicação é obrigatório.",
          details: "Erro ao registrar livro. O ano de publicação contém um valor inválido ou vazio.",
        },
        { status: 400 }
      );
    }
    
    if (!body.paginas || body.paginas <= 0 || typeof body.paginas !== "number") {
      return Response.json(
        {
          error: "Quantidade de páginas é obrigatório.",
          details: "Erro ao registrar livro. A quantidade de páginas contém um valor inválido ou vazio.",
        },
        { status: 400 }
      );
    }

    if (!body.status || !["Lido", "Lendo", "Quero Ler"].includes(body.status)) {
      return Response.json(
        {
          error: "Status inválido.",
          details: "O status deve ser: Lido, Lendo ou Quero Ler.",
        },
        { status: 400 }
      );
    }

    // Validação opcional para imagem
    if (body.imagem && typeof body.imagem !== "string") {
      return Response.json(
        {
          error: "URL da imagem inválida.",
          details: "Erro ao registrar livro. A URL da imagem deve ser uma string válida.",
        },
        { status: 400 }
      );
    }

    const newBook: Book = createBook(
      body.titulo.trim(),
      body.autor.trim(),
      body.genero.trim(),
      body.anoPublicacao,
      body.paginas,
      body.status,
      body.avaliacao,
      body.imagem?.trim() || ""
    );

    // Lê os livros existentes
    const books = await loadBooks();

    // Adiciona o novo livro
    books.push(newBook);

    // Salva no arquivo
    await saveBooks(books);

    return Response.json({
      message: "Livro registrado com sucesso!",
      livro: newBook,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Erro ao registrar livro:", error);
    return Response.json(
      { 
        error: "Não foi possível registrar o livro.", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updatedBooks: Book[] = await request.json();
    
    // Validar dados
    if (!Array.isArray(updatedBooks)) {
      return Response.json(
        { error: "Dados inválidos. Esperado array de livros." },
        { status: 400 }
      );
    }

    // Validar cada livro no array
    for (const book of updatedBooks) {
      if (!book.id || !book.titulo || !book.autor || !book.genero) {
        return Response.json(
          { error: "Dados de livro inválidos no array." },
          { status: 400 }
        );
      }
    }

    // Salvar array atualizado
    await saveBooks(updatedBooks);

    return Response.json({
      message: "Livros atualizados com sucesso!",
      books: updatedBooks
    });

  } catch (error: any) {
    console.error("Erro ao atualizar livros:", error);
    return Response.json(
      { 
        error: "Não foi possível atualizar os livros.", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}