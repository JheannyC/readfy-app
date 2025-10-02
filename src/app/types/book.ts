// Gera ID único usando crypto (nativo) ou fallback
function generateId(): string {
  if (typeof crypto !== 'undefined') {
    return crypto.randomUUID();
  }
  // Fallback para ambientes sem crypto
  return Date.now().toString() + Math.random().toString(36).substring(2);
}

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anoPublicacao: number;
  paginas: number;
  status: 'Lido' | 'Lendo' | 'Não Lido'; // ← AQUI ESTÁ DEFINIDO
  avaliacao: number;
  isbn?: string;
  currentPage?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createBook(
  titulo: string,
  autor: string,
  genero: string,
  anoPublicacao: number,
  paginas: number,
  status: 'Lido' | 'Lendo' | 'Não Lido' = 'Não Lido', // ← E AQUI
  avaliacao: number = 0,
  isbn?: string,
  currentPage?: number,
  notes?: string
): Book {
  return {
    id: generateId(),
    titulo,
    autor,
    genero,
    anoPublicacao,
    paginas,
    status, // ← USA O STATUS CORRETO
    avaliacao,
    isbn,
    currentPage,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}