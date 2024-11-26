import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useDeletePostMutation, useGetDataQuery } from "../api";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDeleteModal from "../components/modal/DeleteModal";
import Loader from "../components/loader";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationDialog from "../components/modal/ConfirmationDialog";
import Pagination from "../components/pagination/Pagination";
import VideoModal from "../components/modal/VideoModal";
import { PiEye } from "react-icons/pi";
import { SponsorCompanytypes } from "../types";

const SponserCompany = () => {
  const { data, isLoading, isError } = useGetDataQuery({
    url: "/sponsor/company",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //calculation of page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentSponser = data?.slice(indexOfFirstItem, indexOfLastItem);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const [dialogCrendial, setDialogCrendial] = useState({
    targetUrl: "",
    showDialog: false,
  });

  const [videoModal, setVideoModal] = useState({
    conditon: false,
    url: "",
  });

  const navigate = useNavigate();

  const handleLinkClick = (url: string) => {
    setDialogCrendial((prev) => ({
      ...prev,
      targetUrl: url,
      showDialog: true,
    }));
  };

  const handleCloseDialog = () => {
    setDialogCrendial((prev) => ({
      ...prev,
      targetUrl: "",
      showDialog: false,
    }));
  };

  const handleConfirmRedirect = () => {
    window.open(dialogCrendial.targetUrl, "_blank");
    handleCloseDialog();
  };

  const [deletPost] = useDeletePostMutation();

  const [isModalOpen, setModalOpen] = useState({
    condition: false,
    id: "",
  });

  console.log(data);

  const handleCloseModal = () => {
    setModalOpen({
      condition: false,
      id: "",
    });
  };

  const deletcompany = (id: string) => {
    setModalOpen((prev) => ({
      ...prev,
      condition: !prev.condition,
      id: id,
    }));
  };
  const updatecompany = (company: SponsorCompanytypes) => {
    navigate(`/sponsor/company_form/${company._id}`);
  };

  const handleConfirmDelete = () => {
    // Handle the delete action here
    toast.loading("checking Details");
    deletPost({
      url: `/sponsor/company/${isModalOpen.id}`,
    })
      .then((res) => {
        if (res.data.success) {
          toast.dismiss();
          toast.success(`${res.data.message}`);
        }
        console.log(res);
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Not successfull to delete");
      });
    setModalOpen({
      condition: false,
      id: "",
    });
  };

  const listHeadingCompanies = [
    "Name",
    "Type",
    "Logo",
    "Video",
    "Discription",
    "Website",
    "Status",
    "Products",
    // "Since",
    "View",
    "Setting",
  ];

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
      <ToastContainer />
      {isLoading && <Loader />}
      {isModalOpen.condition && (
        <ConfirmDeleteModal
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      )}
      {videoModal.conditon && (
        <VideoModal url={videoModal.url} onClose={handleCloseVideoModal} />
      )}
      <section
        className={`  md:pl-0 p-4 h-full  w-full rounded-md   mx-auto [&::-webkit-scrollbar]:hidden `}
      >
        <section
          className={` md:p-8 p-6 h-full border-gray-200 rounded-md  max-w-full w-full `}
        >
          <div className="flex items-center mb-2 md:mb-6">
            <h1 className=" text-[28px] font-bold md:text-4xl text-gray-600 font-mavenPro">
              Companies
            </h1>
          </div>
          <div className="flex justify-between mb-4">
            <div className={`flex items-center   `}>
              <input
                type="search"
                placeholder={`Search`}
                className={` p-2 text-sm md:text-base  sm:px-4 py-1 border-[2px] border-transparent 
           bg-slate-50 focus:border-gray-100
        shadow-inner rounded-[0.26rem] outline-none `}
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                // onFocus={() => setCurrentPage(1)}
              />
            </div>
            <div className="relative flex items-center self-end ">
              <button
                className={` px-2 py-1 
                   bg-[#1f3c88] hover:bg-[#2d56bb]  text-[#DEE1E2] font-semibold
              }    rounded shadow-xl md:px-4 md:py-2  sm:self-center`}
              >
                <Link to={"/sponsor/company_form"}>
                  <span className="hidden md:inline-block">
                    Add Sponsor Company
                  </span>

                  <IoIosSend className="w-6 h-6 md:hidden" />
                </Link>
              </button>
            </div>
          </div>
          <section
            className={`w-full overflow-auto   border-2 [&::-webkit-scrollbar]:hidden rounded-lg border-gray-200 shadow-md bg-white`}
          >
            <section className="grid grid-cols-customCompanies pb-2 p-2  gap-4   min-w-[1260px] font-medium md:font-semibold bg-white font-mavenPro">
              <p className="pl-2 md:text-lg">SrNo.</p>

              {listHeadingCompanies?.map((heading: string, index: number) => (
                <p
                  key={index}
                  className={`   md:text-lg ${
                    index !== 0 ? "justify-self-center" : "ml-10"
                  }`}
                >
                  {heading.charAt(0).toUpperCase() + heading.slice(1)}
                </p>
              ))}
            </section>
            <div className=" h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[1260px] bg-gray-50">
              {isLoading ? (
                <p>Loading...</p>
              ) : isError ? (
                <p className="flex items-center justify-center w-full h-full font-medium text-center text-rose-800">
                  Check Internet connection or Contact to Admin
                </p>
              ) : (
                currentSponser?.map(
                  (company: SponsorCompanytypes, i: number) => (
                    <section
                      key={i}
                      className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customCompanies group hover:bg-gray-50"
                    >
                      <span>{i + 1}</span>

                      <span
                        className={`  font-semibold text-center  rounded-full  `}
                      >
                        {company?.name}
                      </span>

                      <span className="text-sm font-semibold break-words break-all text-ellipsis">
                        {company?.type}
                      </span>

                      <div className="flex items-center justify-center">
                        {company?.image ? (
                          <img
                            src={company?.image}
                            alt="company Logo"
                            className="object-contain w-full text-sm text-center rounded-lg h-1/2 "
                          />
                        ) : (
                          <span className="text-sm font-bold text-gray-400">
                            No Image
                          </span>
                        )}
                      </div>
                      <span
                        className="flex justify-center ml-2 text-sm font-semibold cursor-pointer hover:underline hover:text-sky-400"
                        typeof="button"
                        onClick={() => handlingVideo(company?.video)}
                      >
                        {company?.video ? "View Video" : "--"}
                      </span>
                      <span className="flex justify-center text-sm font-semibold ">
                        {company?.description || "--"}
                      </span>
                      <span
                        onClick={() =>
                          company?.link && handleLinkClick(company.link)
                        }
                        className={` text-sm font-semibold text-center ${
                          company?.link
                            ? "hover:underline hover:text-sky-400 "
                            : ""
                        } break-words break-all cursor-pointer `}
                      >
                        {company?.link ? "Official site" : "----"}
                      </span>
                      <ConfirmationDialog
                        show={dialogCrendial?.showDialog}
                        onClose={handleCloseDialog}
                        onConfirm={handleConfirmRedirect}
                      />
                      <span className="flex justify-center ml-2 text-sm font-semibold ">
                        {company?.active === true ? "Active" : "not Active"}
                      </span>
                      <span className="flex justify-center ml-2 text-sm font-semibold ">
                        {company?.products.length || 0}
                      </span>
                      <div className="flex justify-center">
                        <button className="px-2 py-2 text-white bg-blue-400 rounded-md hover:bg-blue-500">
                          <Link
                            to={`/sponsor/profile/${company._id}`}
                            className="flex items-center justify-center text-sm font-semibold "
                          >
                            <PiEye className="w-4 h-4" />
                          </Link>
                        </button>
                      </div>

                      <div className="grid justify-center gap-2">
                        <button
                          className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb]"
                          onClick={() => updatecompany(company)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-rose-600 hover:bg-rose-700"
                          onClick={() => deletcompany(company._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </section>
                  )
                )
              )}
            </div>
          </section>

          <Pagination
            currentPage={currentPage}
            apiData={data}
            itemsPerPage={itemsPerPage}
            handleClick={handleClick}
          />
        </section>
      </section>
    </>
  );
};

export default SponserCompany;
