import React from "react";
import { IoClose } from "react-icons/io5";
import ReactPlayer from "react-player";
interface Props{
  onClose:()=>void,
  url:string
}
const VideoModal = ({ url, onClose }:Props) => {
  const handlingStopPro = (e:React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <section
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="rounded-lg w-[600px] bg-black relative h-[400px]"
        onClick={handlingStopPro}
      >
        <ReactPlayer url={url} width="100%" height="100%" controls />

        <div className="absolute flex justify-end space-x-4 top-1 right-1">
          <button
            onClick={onClose}
            className="px-2 py-2 font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-400"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default VideoModal;
