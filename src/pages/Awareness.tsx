import { Link, useNavigate } from "react-router-dom";
import { useDeletePostMutation, useGetDataQuery } from "../api";
import Loader from "../components/loader";
import DeleteICONSVG from "../assets/SVG/deleteICON";
import EditICONSVG from "../assets/SVG/editICON";
import { useState } from "react";
import ConfirmDeleteModal from "../components/modal/DeleteModal";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../components/pagination/Pagination";
import { IoIosSend } from "react-icons/io";
import { AwarenessTypes } from "../types";
import { getMediaUrl } from "../utils/getMediaUrl";

const Awareness = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetDataQuery({
    url: "/awareness",
  });

  const [deletPost] = useDeletePostMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [searchQuery, setSearchQuery] = useState("");

  //calculation of page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter data based on search query
  const filteredData = data?.filter((item: AwarenessTypes) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentAwareness = filteredData?.slice(indexOfFirstItem, indexOfLastItem);


  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

  const updateHandler = (user: AwarenessTypes) => {
    navigate(`/awareness/${user?._id}`);
  };

  const deletHandler = (id: string) => {
    setModalOpen((prev) => ({
      ...prev,
      condition: !prev.condition,
      id: id,
    }));
  };

  const handleConfirmDelete = () => {
    toast.loading("checking Details");
    deletPost({ url: `/awareness/${isModalOpen.id}`, }).then((res) => {
      if (res.data.success) {
        toast.dismiss();
        toast.success(`${res.data.message}`);
      }
      console.log(res);
    }).catch(() => {
      toast.dismiss();
      toast.error("Not successfull to delete");
    });
    setModalOpen({
      condition: false,
      id: "",
    });
  };

  const listHeadingAwarness = ["Title", "Category", "Date", "Image", "Setting"];
  return (
    <>
      {isLoading && <Loader />}
      <ToastContainer />
      {isModalOpen.condition && (
        <ConfirmDeleteModal
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      )}

      <section className={`  md:pl-0 p-4 h-full  w-full rounded-md   mx-auto [&::-webkit-scrollbar]:hidden `}>
        <section className={` md:p-8 p-6 h-full border-gray-200 rounded-md  max-w-full w-full `}>
          <div className="flex items-center mb-2 md:mb-6">
            <h1 className=" text-[28px] font-bold md:text-4xl text-gray-600 font-mavenPro">Awareness</h1>
          </div>
          <div className="flex justify-between mb-4">
            <div className={`flex items-center   `}>
              <input
                type="search"
                placeholder={`Search`}
                className={` p-2 text-sm md:text-base  sm:px-4 py-1 border-[2px] border-transparent 
                   bg-slate-50 focus:border-gray-100
                shadow-inner rounded-[0.26rem] outline-none `}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setCurrentPage(1)}
              />
            </div>
            <div className="relative flex items-center self-end ">
              <button
                className={` px-2 py-1 
                           bg-[#1f3c88] hover:bg-[#2d56bb]  text-[#DEE1E2] font-semibold
                      }    rounded shadow-xl md:px-4 md:py-2  sm:self-center`}
              >
                <Link to={"/awareness/creat-awareness"}>
                  <span className="hidden md:inline-block">
                    Creat Awareness
                  </span>

                  <IoIosSend className="w-6 h-6 md:hidden" />
                </Link>
              </button>
            </div>
          </div>
          <section className={`w-full overflow-auto   border-2 [&::-webkit-scrollbar]:hidden rounded-lg border-gray-200 shadow-md bg-white`}>
            <section className="grid grid-cols-customAwarness pb-2 p-2  gap-4   min-w-[800px] font-medium md:font-semibold bg-white font-mavenPro">
              <p className="pl-2 md:text-lg">SrNo.</p>

              {listHeadingAwarness?.map((heading: string, index: number) => (
                <p key={index} className={`   md:text-lg ${index !== 0 ? "justify-self-center" : "ml-20"}`}>{heading.charAt(0).toUpperCase() + heading.slice(1)}</p>
              ))}
            </section>

            <div className=" h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[800px] bg-gray-50">
              {isLoading ? (
                <p>Loading...</p>
              ) : isError ? (
                <p className="flex items-center justify-center w-full h-full font-medium text-center text-rose-800">
                  Check Internet connection or Contact to Admin
                </p>
              ) : filteredData?.length > 0 ? (
                currentAwareness?.map((awar: AwarenessTypes, i: number) => (
                  <section key={i} className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customAwarness group hover:bg-gray-50">
                    <span>{i + 1}</span>

                    <span className={`font-semibold text-center  rounded-full  `}>{awar?.title ? awar?.title : "---"}</span>
                    <span className={`font-semibold text-center  rounded-full  `}>{awar?.category ? awar?.category?.name : "--"}</span>
                    <span className={`font-semibold text-center  rounded-full  `}>{awar?.createdAt ? new Date(awar?.createdAt?.split("T")[0]).toLocaleDateString() : ""}</span>

                    <div className="flex items-center justify-center">
                      {awar?.image ? (
                        <img src={getMediaUrl(awar?.image, "awareness")} alt="Awareness Image" className="object-cover w-24 h-24 rounded-full " />
                      ) : (
                        <span className="text-sm font-bold text-gray-400">No Image</span>
                      )}
                    </div>

                    <div className="grid justify-center gap-2">
                      <button className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb]" onClick={() => updateHandler(awar)}>
                        {/* Edit */}
                        <EditICONSVG height={18} width={18} fill={"white"} />
                      </button>

                      <button className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-rose-600 hover:bg-rose-700" onClick={() => deletHandler(awar?._id)}>
                        {/* Delete */}
                        <DeleteICONSVG height={18} width={18} fill={"white"} />
                      </button>
                    </div>
                  </section>
                ))
              ) : (
                <div>No Data Found</div>
              )}
            </div>
          </section>

          <Pagination<AwarenessTypes>
            currentPage={currentPage}
            apiData={filteredData}
            itemsPerPage={itemsPerPage}
            handleClick={handleClick}
          />
        </section>
      </section>
    </>
  );
};
export default Awareness;
