import { Link, useNavigate } from "react-router-dom";
import DeleteICONSVG from "../assets/SVG/deleteICON";
import EditICONSVG from "../assets/SVG/editICON";
import { useDeletePostMutation, useGetDataQuery } from "../api";
import { videosTypes } from "../types";
import Loader from "../components/loader";
import Pagination from "../components/pagination/Pagination";
import { useState } from "react";
import { IoIosSend } from "react-icons/io";

import { toast, ToastContainer } from "react-toastify";
import VideoModal from "../components/modal/VideoModal";
import ConfirmDeleteModal from "../components/modal/DeleteModal";
import { getMediaUrl } from "../utils/getMediaUrl";

const Video = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDataQuery({
    url: "/video/get-all-video",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  //calculation of page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // const currentVideos = data?.slice(indexOfFirstItem, indexOfLastItem);

  // Filter data based on search query
  const filteredData = data?.filter((item: videosTypes) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentVideos = filteredData?.slice(indexOfFirstItem, indexOfLastItem);


  const [videoModal, setVideoModal] = useState({
    conditon: false,
    url: "",
  });

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const listHeadingOfVideo = [
    "Title",
    "Category",
    "Image",
    "Video",
    // "Dectription",
    "CreatedAt",
    "Tags",
    "Settings",
  ];

  // console.log(data, "from video");

  const [deletPost] = useDeletePostMutation();

  const [isModalOpen, setModalOpen] = useState({
    condition: false,
    id: "",
  });


  const handleCloseModal = () => {
    setModalOpen({
      condition: false,
      id: "",
    });
  };

  const deletvideo = (id: string) => {
    setModalOpen((prev) => ({
      ...prev,
      condition: !prev.condition,
      id: id,
    }));
  };
  const updatevideo = (video: videosTypes) => {
    navigate(`/videos/${video._id}`);
  };

  const handleConfirmDelete = () => {
    // Handle the delete action here
    toast.loading("checking Details");

    deletPost({ url: `/video/delete/${isModalOpen.id}`, }).then((res) => {
      console.log("response: ", res);

      if (res.data.success) {
        toast.dismiss();
        toast.success(`${res.data.message}`);
      }
    }).catch((error: any) => {
      console.log("error: ", error);

      toast.dismiss();
      toast.error("Not successfull to delete");
    });
    setModalOpen({
      condition: false,
      id: "",
    });
  };

  const handlingVideo = (url: string) => {
    setVideoModal((prev) => ({
      ...prev,
      conditon: true,
      url: url,
    }));
  };

  const handleCloseVideoModal = () => {
    setVideoModal((prev) => ({
      ...prev,
      conditon: false,
      url: "",
    }));
  };

  return (
    <>
      {isLoading && <Loader />}
      <ToastContainer />
      {isModalOpen.condition && (
        <ConfirmDeleteModal onClose={handleCloseModal} onConfirm={handleConfirmDelete} />
      )}
      {videoModal.conditon && (
        <VideoModal url={videoModal.url} onClose={handleCloseVideoModal} />
      )}

      <section className={`  md:pl-0 p-4 h-full  w-full rounded-md   mx-auto [&::-webkit-scrollbar]:hidden `}>
        <section className={` md:p-8 p-6 h-full border-gray-200 rounded-md  max-w-full w-full `}>
          <div className="flex items-center mb-2 md:mb-6">
            <h1 className=" text-[28px] font-bold md:text-4xl text-gray-600 font-mavenPro">Videos</h1>
          </div>
          <div className="flex justify-between mb-4">
            <div className={`flex items-center   `}>
              <input type="search" placeholder={`Search`} className={` p-2 text-sm md:text-base  sm:px-4 py-1 border-[2px] border-transparent bg-slate-50 focus:border-gray-100 shadow-inner rounded-[0.26rem] outline-none `} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setCurrentPage(1)} />
            </div>
            <div className="relative flex items-center self-end ">
              <button className={` px-2 py-1 bg-[#1f3c88] hover:bg-[#2d56bb]  text-[#DEE1E2] font-semibold rounded shadow-xl md:px-4 md:py-2  sm:self-center`}>
                <Link to={"/videos/upload-video"}>
                  <span className="hidden md:inline-block">Upload Video</span>
                  <IoIosSend className="w-6 h-6 md:hidden" />
                </Link>
              </button>
            </div>
          </div>
          <section className={`w-full overflow-auto   border-2 [&::-webkit-scrollbar]:hidden rounded-lg border-gray-200 shadow-md bg-white`}>
            <section className="grid grid-cols-customVideo pb-2 p-2  gap-4   min-w-[1260px] font-medium md:font-semibold bg-white font-mavenPro">
              <p className="pl-2 md:text-lg">SrNo.</p>

              {listHeadingOfVideo.map((heading, index) => (
                <p key={index} className={`   md:text-lg ${index !== 0 ? "justify-self-center" : "ml-20"}`}>{heading.charAt(0).toUpperCase() + heading.slice(1)}</p>
              ))}
            </section>
            <div className=" h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[1260px] bg-gray-50">
              {isLoading ? (
                <p>Loading...</p>
              ) : isError ? (
                <p className="flex items-center justify-center w-full h-full font-medium text-center text-rose-800">Check Internet connection or Contact to Admin                </p>
              ) : (
                currentVideos?.map((video: videosTypes, i: number) => (
                  <section key={i} className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customVideo group hover:bg-gray-50">
                    <span>{i + 1}</span>

                    <span className={`font-semibold text-center rounded-full`}>{video?.title}</span>

                    <span className="text-sm font-semibold text-center break-words break-all text-ellipsis">{video?.category}</span>

                    <div className="flex items-center justify-center">
                      {video?.thumnail ? (
                        <img src={getMediaUrl(video?.thumnail, "uploadThumbnail")} alt="video Image" className="object-contain w-24 h-24 rounded-lg" />
                      ) : (
                        <span className="text-sm font-bold text-gray-400">No Image</span>
                      )}
                    </div>
                    <span className="flex justify-center ml-2 text-sm font-semibold cursor-pointer hover:underline hover:text-sky-400" typeof="button" onClick={() => handlingVideo(getMediaUrl(video?.url, "uploadVideo"))}>
                      {video?.url ? "View Video" : "--"}
                    </span>
                    {/* <span className="flex justify-center text-sm font-semibold ">
                      {video?.description ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: video?.description,
                          }}
                        />
                      ) : (
                        "--"
                      )}
                    </span> */}
                    <span className="flex justify-center text-sm font-semibold ">{video?.createdAt ? new Date(video.createdAt).toLocaleDateString() : ""}</span>

                    <span className="flex justify-center text-sm font-semibold ">
                      {video?.tags.length > 0 ? (
                        video?.tags.map((tag: string, index: number) => (
                          <ul key={index}>
                            <li>
                              {tag}
                              {index !== video.tags.length - 1 && ","}
                            </li>
                          </ul>
                        ))
                      ) : (
                        "--"
                      )}

                    </span>

                    <div className="grid justify-center gap-2">
                      <button className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb]" onClick={() => updatevideo(video)}>
                        <EditICONSVG height={18} width={18} fill={"white"} />
                      </button>

                      <button className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-rose-600 hover:bg-rose-700" onClick={() => deletvideo(video._id)}>
                        <DeleteICONSVG height={18} width={18} fill={"white"} />
                      </button>
                    </div>
                  </section>
                ))
              )}
            </div>
          </section>

          <Pagination<videosTypes> currentPage={currentPage} apiData={filteredData} itemsPerPage={itemsPerPage} handleClick={handleClick} />
        </section>
      </section>
    </>
  );
};
export default Video;
