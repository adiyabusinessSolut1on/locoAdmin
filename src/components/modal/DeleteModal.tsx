// ConfirmDeleteModal.js
import React from "react";
interface Props {
  onClose: () => void,
  onConfirm: () => void
}

const ConfirmDeleteModal = ({ onClose, onConfirm }: Props) => {
  const preventhandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-50" onClick={onClose}>
      <div className="p-6 bg-white rounded-lg shadow-lg" onClick={preventhandler}>
        <h2 className="mb-4 text-xl font-bold text-gray-700">Are you sure you want to delete this?</h2>
        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 font-semibold text-gray-800 bg-gray-200 rounded hover:bg-gray-300" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 font-semibold text-white bg-red-600 rounded hover:bg-red-700" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
