interface Props{
  show:boolean,
  onClose:()=>void,
  onConfirm:()=>void
}

const ConfirmationDialog = ({ show, onClose, onConfirm }:Props) => {
  if (!show) return null;

  const handlingPropogation = (e:React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 cursor-pointer bg-black/60"
      onClick={onClose}
    >
      <div
        className="p-6 bg-white rounded-md cursor-default"
        onClick={handlingPropogation}
      >
        <h2 className="mb-4 text-lg font-semibold">
          Are you sure you want to move to this website?
        </h2>
        <div className="flex justify-end space-x-4 text-white">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-black bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 font-semibold rounded-md bg-rose-600 hover:bg-rose-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
