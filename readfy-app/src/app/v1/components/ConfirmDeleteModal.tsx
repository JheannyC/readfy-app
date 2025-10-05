interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
  loading?: boolean;
  spinner?: React.ReactNode;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  bookTitle,
  loading = false,
  spinner,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Confirmar exclusão
        </h2>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir o livro{" "}
          <strong>{bookTitle}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white flex items-center justify-center min-w-[100px]"
          >
            {loading ? spinner : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
