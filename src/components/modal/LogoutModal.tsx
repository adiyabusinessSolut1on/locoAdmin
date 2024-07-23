import React from "react";
interface Props {
  onClose: () => void;
  onConfirm: () => void;
}
const LogOutModal = ({ onClose, onConfirm }: Props) => {
  const handlingPropogation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 cursor-pointer bg-black/60"
      onClick={onClose}
    >
      <div
        className="p-6 text-gray-800 bg-white rounded-md cursor-default"
        onClick={handlingPropogation}
      >
        <h2 className="mb-4 text-lg font-semibold">
          Are you sure you want to Logout
        </h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-white bg-blue-400 rounded-md hover:bg-blue-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 font-semibold text-white rounded-md bg-rose-600 hover:bg-rose-700"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogOutModal;
