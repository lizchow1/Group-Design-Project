const Modal = ({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <div className="text-gray-600 mb-6">
            {typeof message === "string" ? <p>{message}</p> : message}
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-red rounded-lg hover:bg-red-600 transition"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  