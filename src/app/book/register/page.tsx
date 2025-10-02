'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BookFormData {
  titulo: string;
  autor: string;
  genero: string;
  anoPublicacao: string;
  paginas: string;
  status: 'Lido' | 'Lendo' | 'Não Lido';
  avaliacao: string;
  isbn: string;
  currentPage: string;
  notes: string;
}

export default function RegisterBook() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookFormData>({
    titulo: '',
    autor: '',
    genero: '',
    anoPublicacao: '',
    paginas: '',
    status: 'Não Lido',
    avaliacao: '0',
    isbn: '',
    currentPage: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔄 Enviando dados...', formData);
      
      const response = await fetch('/api/book/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: formData.titulo,
          autor: formData.autor,
          genero: formData.genero,
          anoPublicacao: parseInt(formData.anoPublicacao),
          paginas: parseInt(formData.paginas),
          status: formData.status,
          avaliacao: parseInt(formData.avaliacao),
          isbn: formData.isbn || undefined,
          currentPage: formData.currentPage ? parseInt(formData.currentPage) : undefined,
          notes: formData.notes || undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Livro cadastrado:', result);
        alert('Livro cadastrado com sucesso!');
        router.push('/dashboard');
        router.refresh();
      } else {
        const errorData = await response.json();
        console.error('❌ Erro na resposta:', errorData);
        alert(errorData.error || 'Erro ao cadastrar livro');
      }
    } catch (error) {
      console.error('💥 Erro de conexão:', error);
      alert('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BookFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Voltar para Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">📖 Cadastrar Novo Livro</h1>
          <p className="text-gray-600 mt-2">Preencha as informações do livro para adicionar à sua biblioteca</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Título *"
                type="text"
                value={formData.titulo}
                onChange={(value) => handleInputChange('titulo', value)}
                placeholder="Ex: Dom Casmurro"
                required
              />
              
              <FormField
                label="Autor *"
                type="text"
                value={formData.autor}
                onChange={(value) => handleInputChange('autor', value)}
                placeholder="Ex: Machado de Assis"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Gênero *"
                type="text"
                value={formData.genero}
                onChange={(value) => handleInputChange('genero', value)}
                placeholder="Ex: Romance, Ficção, etc."
                required
              />
              
              <FormField
                label="ISBN"
                type="text"
                value={formData.isbn}
                onChange={(value) => handleInputChange('isbn', value)}
                placeholder="Ex: 978-85-359-0276-2"
              />
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📅 Detalhes da Publicação</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Ano de Publicação *"
                type="number"
                value={formData.anoPublicacao}
                onChange={(value) => handleInputChange('anoPublicacao', value)}
                placeholder="Ex: 1999"
                min="1000"
                max="2025"
                required
              />
              
              <FormField
                label="Número de Páginas *"
                type="number"
                value={formData.paginas}
                onChange={(value) => handleInputChange('paginas', value)}
                placeholder="Ex: 256"
                min="1"
                required
              />
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Status de Leitura</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Status *"
                value={formData.status}
                onChange={(value) => handleInputChange('status', value)}
                options={[
                  { value: 'Não Lido', label: '📚 Não Lido (Aberto)' },
                  { value: 'Lendo', label: '📖 Lendo (Em andamento)' },
                  { value: 'Lido', label: '✅ Lido (Finalizado)' }
                ]}
              />
              
              <FormField
                label="Página Atual"
                type="number"
                value={formData.currentPage}
                onChange={(value) => handleInputChange('currentPage', value)}
                placeholder="Ex: 150"
                min="0"
                max={formData.paginas ? parseInt(formData.paginas) : undefined}
              />
            </div>

            <div className="mt-4">
              <SelectField
                label="Avaliação"
                value={formData.avaliacao}
                onChange={(value) => handleInputChange('avaliacao', value)}
                options={[
                  { value: '0', label: '⭐ Sem avaliação' },
                  { value: '1', label: '⭐' },
                  { value: '2', label: '⭐⭐' },
                  { value: '3', label: '⭐⭐⭐' },
                  { value: '4', label: '⭐⭐⭐⭐' },
                  { value: '5', label: '⭐⭐⭐⭐⭐' }
                ]}
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 Anotações Pessoais</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas e Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Digite suas anotações sobre o livro..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/dashboard"
              className="flex-1 bg-gray-500 text-white text-center py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Cadastrando...
                </span>
              ) : (
                '📚 Cadastrar Livro'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Dicas</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Campos marcados com * são obrigatórios</li>
            <li>• O ISBN ajuda a identificar edições específicas</li>
            <li>• As anotações podem ser editadas posteriormente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Componente para campos de texto/número - CORRIGIDO
interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
}

function FormField({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  required,
  min,
  max 
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
    </div>
  );
}

// Componente para campos de seleção - CORRIGIDO
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function SelectField({ 
  label, 
  value, 
  onChange, 
  options 
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}