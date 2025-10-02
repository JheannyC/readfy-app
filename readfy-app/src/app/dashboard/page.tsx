'use client';

import { useState, useEffect } from 'react';

interface Book {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anoPublicacao: number;
  paginas: number;
  status: 'Lido' | 'Lendo' | 'Não Lido';
  avaliacao: number;
}

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Carregar livros
  useEffect(() => {
    loadBooks();
  }, []);

  // Filtrar livros quando searchTerm mudar
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = books.filter(book =>
        book.titulo.toLowerCase().includes(searchLower) ||
        book.autor.toLowerCase().includes(searchLower) ||
        book.genero.toLowerCase().includes(searchLower)
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm, books]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/books');
      
      if (response.ok) {
        const result = await response.json();
        setBooks(result.books || []);
      } else {
        console.error('Erro ao carregar livros');
        // Se a API falhar, usar dados de exemplo
        addSampleBooks();
      }
    } catch (error) {
      console.error('Erro:', error);
      // Se houver erro, usar dados de exemplo
      addSampleBooks();
    } finally {
      setLoading(false);
    }
  };

  // Dados de exemplo com títulos diferentes
  const addSampleBooks = () => {
    const sampleBooks: Book[] = [
      {
        id: '1',
        titulo: 'Dom Casmurro',
        autor: 'Machado de Assis',
        genero: 'Romance',
        anoPublicacao: 1899,
        paginas: 256,
        status: 'Lido',
        avaliacao: 5
      },
      {
        id: '2',
        titulo: '1984',
        autor: 'George Orwell',
        genero: 'Ficção Científica',
        anoPublicacao: 1949,
        paginas: 328,
        status: 'Lendo',
        avaliacao: 4
      },
      {
        id: '3',
        titulo: 'O Pequeno Príncipe',
        autor: 'Antoine de Saint-Exupéry',
        genero: 'Literatura Infantil',
        anoPublicacao: 1943,
        paginas: 96,
        status: 'Não Lido',
        avaliacao: 0
      },
      {
        id: '4',
        titulo: 'Harry Potter e a Pedra Filosofal',
        autor: 'J.K. Rowling',
        genero: 'Fantasia',
        anoPublicacao: 1997,
        paginas: 223,
        status: 'Lido',
        avaliacao: 5
      },
      {
        id: '5',
        titulo: 'O Senhor dos Anéis',
        autor: 'J.R.R. Tolkien',
        genero: 'Fantasia',
        anoPublicacao: 1954,
        paginas: 1178,
        status: 'Lendo',
        avaliacao: 0
      },
      {
        id: '6',
        titulo: 'Orgulho e Preconceito',
        autor: 'Jane Austen',
        genero: 'Romance',
        anoPublicacao: 1813,
        paginas: 432,
        status: 'Não Lido',
        avaliacao: 0
      }
    ];
    
    setBooks(sampleBooks);
    setFilteredBooks(sampleBooks);
    setLoading(false);
  };

  const handleDelete = async (bookId: string) => {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
      try {
        const response = await fetch(`/api/book/${bookId}/delete`, {
          method: 'DELETE',
        });

        if (response.ok) {
          loadBooks();
        }
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando livros...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📚 Dashboard de Livros</h1>
          <p className="text-gray-600">Gerencie sua biblioteca pessoal</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-gray-900">{books.length}</div>
            <div className="text-sm text-gray-600">Total de Livros</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <div className="text-2xl font-bold text-gray-900">
              {books.filter(book => book.status === 'Lido').length}
            </div>
            <div className="text-sm text-gray-600">Lidos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-gray-900">
              {books.filter(book => book.status === 'Lendo').length}
            </div>
            <div className="text-sm text-gray-600">Lendo</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-500">
            <div className="text-2xl font-bold text-gray-900">
              {books.filter(book => book.status === 'Não Lido').length}
            </div>
            <div className="text-sm text-gray-600">Não Lidos</div>
          </div>
        </div>

        {/* Barra de Busca - CORRIGIDA */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Buscar por título, autor ou gênero..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-500">
              {filteredBooks.length} resultado{filteredBooks.length !== 1 ? 's' : ''} encontrado{filteredBooks.length !== 1 ? 's' : ''}
              {filteredBooks.length === 0 && ' - Nenhum livro encontrado'}
            </div>
          )}
        </div>

        {/* Grid de Livros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <BookCard key={book.id} book={book} onDelete={handleDelete} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">
                {searchTerm ? 'Nenhum livro encontrado para sua busca.' : 'Nenhum livro cadastrado.'}
              </div>
              {!searchTerm && (
                <a 
                  href="/book/register"
                  className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Cadastrar Primeiro Livro
                </a>
              )}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Limpar Busca
                </button>
              )}
            </div>
          )}
        </div>

        {/* Total de livros */}
        <div className="mt-6 text-sm text-gray-500">
          Total: {filteredBooks.length} livro{filteredBooks.length !== 1 ? 's' : ''}
          {searchTerm && ` • Resultados para: "${searchTerm}"`}
        </div>

        {/* Botão para recarregar/adicionar dados de exemplo */}
        {books.length === 0 && (
          <div className="text-center mt-8">
            <button
              onClick={addSampleBooks}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              📚 Carregar Livros de Exemplo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente BookCard - MANTIDO O LAYOUT ORIGINAL
function BookCard({ book, onDelete }: { book: Book; onDelete: (id: string) => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lido': return 'bg-green-100 text-green-800';
      case 'Lendo': return 'bg-blue-100 text-blue-800';
      case 'Não Lido': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {book.titulo}
          </h3>
          <p className="text-sm text-gray-600 mt-1">por {book.autor}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
          {book.status}
        </span>
      </div>

      {/* Informações do Livro */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Gênero:</span>
          <span className="font-medium">{book.genero}</span>
        </div>
        <div className="flex justify-between">
          <span>Ano:</span>
          <span className="font-medium">{book.anoPublicacao}</span>
        </div>
        <div className="flex justify-between">
          <span>Páginas:</span>
          <span className="font-medium">{book.paginas}</span>
        </div>
        {book.avaliacao > 0 && (
          <div className="flex justify-between items-center">
            <span>Avaliação:</span>
            <span className="text-yellow-600 text-xs">
              {getRatingStars(book.avaliacao)}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
        <a
          href={`/book/${book.id}/edit`}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Editar livro"
        >
          ✏️
        </a>
        <button
          onClick={() => onDelete(book.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Excluir livro"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}