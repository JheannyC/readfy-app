"use client";

export default function BookFormSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-pulse">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-6 w-40 bg-gray-300 rounded mb-3"></div>
          <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <div className="h-5 w-32 bg-gray-300 rounded mb-4"></div>
            <div className="h-48 w-32 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-3 w-40 bg-gray-100 rounded mt-2"></div>
          </div>

          {/* Campos de texto */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}

          {/* Notas */}
          <div className="h-24 bg-gray-200 rounded"></div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <div className="flex-1 h-12 bg-gray-300 rounded"></div>
            <div className="flex-1 h-12 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
