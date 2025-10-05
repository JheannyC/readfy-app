export default function SkeletonBookCard() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="h-16 shrink-0" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md flex flex-col md:flex-row p-6 animate-pulse">
          {/* Capa do livro */}
          <div className="w-full md:w-1/3 bg-gray-200 rounded-t-md md:rounded-l-md min-h-[350px] flex-shrink-0" />

          {/* Conteúdo do livro */}
          <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Título e autor */}
              <div className="h-10 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-5 w-1/2 bg-gray-300 rounded"></div>

              {/* Status */}
              <div className="h-6 w-32 bg-gray-300 rounded-full mt-2"></div>

              {/* Detalhes do livro */}
              <div className="space-y-2 mt-4">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>

              {/* Notas */}
              <div className="h-16 w-full bg-gray-200 rounded mt-2" />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-100">
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          </div>
          </div>
      </main>
    </div>

  );
}