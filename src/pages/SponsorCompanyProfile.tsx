import { useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import { Link, useParams } from "react-router-dom";
import { useDeletePostMutation, useGetDataQuery } from "../api";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { IoIosSend } from "react-icons/io";
import { MdOutlineOndemandVideo } from "react-icons/md";
import ProductForm from "../forms/ProductForm";
import ConfirmationDialog from "../components/modal/ConfirmationDialog";
import Pagination from "../components/pagination/Pagination";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDeleteModal from "../components/modal/DeleteModal";
import VideoModal from "../components/modal/VideoModal";
import SponsorCompanyProfileLoading from "../components/loading_animation/SponsorCompanyProfileLoading";
import { sponsorProductsType } from "../types";
interface stateProps {
  condition: boolean;
  sponsername: string;
  data: {
    _id: string;
    name: string;
    image: string;
    description: string;
    active: boolean;
    link: string;
    sponsorname: string;
    createdAt: string;
  };
}
const SponsorCompanyProfile = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetDataQuery({
    url: `/sponsor/company/${id}`,
  });

  const [isProductForm, setProductForm] = useState<stateProps>({
    condition: false,
    data: {
      _id: "",
      name: "",
      image: "",
      description: "",
      active: true,
      link: "",
      sponsorname: "",
      createdAt: "",
    },
    sponsername: "",
  });

  const [videoModal, setVideoModal] = useState({
    conditon: false,
    url: "",
  });

  const listHeadingProducts = [
    "Name",
    "Image",
    "Description",
    "Sponsor",
    "Website",
    "Status",
    "Setting",
  ];

  const productFormHandler = () => {
    setProductForm((prev) => ({
      ...prev,
      condition: true,

      sponsername: data.name,
    }));
  };

  const closeHandler = () => {
    setProductForm((prev) => ({
      ...prev,
      condition: false,
      data: {
        _id: "",
        name: "",
        image: "",
        description: "",
        active: true,
        link: "",
        sponsorname: "",
        createdAt: "",
      },
      sponsername: "",
    }));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //calculation of page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentSponsorCompanyProducts = data?.products?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const [dialogCrendial, setDialogCrendial] = useState({
    targetUrl: "",
    showDialog: false,
  });

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

  const handleCloseModal = () => {
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
  const handlingCloseVideo = () => {
    setVideoModal((prev) => ({
      ...prev,
      conditon: false,
      url: "",
    }));
  };

  const deletproduct = (id: string) => {
    console.log(id, "from handler");
    setModalOpen((prev) => ({
      ...prev,
      condition: !prev.condition,
      id: id,
    }));
  };
  const updateproduct = (productData: sponsorProductsType) => {
    setProductForm((prev) => ({
      ...prev,
      condition: true,
      data: { ...productData },
    }));
  };

  const handleConfirmDelete = () => {
    // Handle the delete action here
    toast.loading("checking Details");

    deletPost({
      url: `/sponsor/product/${isModalOpen.id}`,
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
  return (
    <>
      <ToastContainer />
      {isModalOpen.condition && (
        <ConfirmDeleteModal
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      )}
      {isProductForm.condition && (
        <ProductForm
          close={closeHandler}
          updateData={isProductForm?.data}
          sponsorname={isProductForm?.sponsername || ""}
        />
      )}
      {videoModal.conditon && (
        <VideoModal url={videoModal.url} onClose={handlingCloseVideo} />
      )}
      {isLoading ? (
        <SponsorCompanyProfileLoading />
      ) : (
        <div
          className={`w-full p-6   
           
               text-gray-600 border-gray-200   rounded-md md:p-8`}
        >
          <div className="flex items-center">
            <HiOutlineOfficeBuilding className=" w-9 h-9" />
            <h1 className="  text-[28px] font-bold  md:text-4xl ml-2 font-mavenPro">
              Sponsore Company
            </h1>
            <Link to={"/sponsor"}>
              <TiArrowBackOutline className="w-10 h-10 ml-4 hover:text-orange-600 text-sky-600" />
            </Link>
          </div>
          <div className="pt-4 border-b border-gray-200"></div>
          <div className="pt-4 mt-4 md:pl-4 font-montserrat">
            <section className="mb-8 ">
              <div className="">
                <div className="relative flex items-center justify-between w-full mb-8">
                  <div className="flex items-center gap-4">
                    <img
                      src={data?.image}
                      alt="company logo or Image"
                      className="w-12 h-12"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-blue-800 md:text-2xl font-mavenPro">
                        {data?.name}
                      </h2>
                      <p className="text-sm font-semibold text-gray-600">
                        {data?.type}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 ">
                  <div className="grid grid-cols-1 col-span-3 gap-6 md:grid-cols-3">
                    <p className="text-sm font-semibold md:text-base ">
                      <span className="pr-2 text-sm text-gray-500 ">
                        Sponsor Type
                      </span>

                      {data?.type}
                    </p>
                    <p className="text-sm font-semibold md:text-base">
                      <span className="pr-2 text-sm text-gray-500 ">
                        Website
                      </span>

                      <span
                        onClick={() => data?.link && handleLinkClick(data.link)}
                        className={` text-sm font-semibold text-center ${
                          data?.link
                            ? "hover:underline hover:text-sky-400 "
                            : ""
                        } break-words break-all cursor-pointer `}
                      >
                        {data?.link ? "Official site" : "----"}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-sm font-semibold md:text-base">
                      <span className="pr-2 text-sm text-gray-500 ">Video</span>
                      <span
                        className="flex justify-center ml-2 text-sm font-semibold cursor-pointer hover:underline hover:text-sky-400"
                        typeof="button"
                        onClick={() => handlingVideo(data?.video)}
                      >
                        {data?.video ? (
                          <MdOutlineOndemandVideo className="w-8 h-8" />
                        ) : (
                          "No video provided"
                        )}
                      </span>
                    </p>

                    <p className="text-sm font-semibold md:text-base">
                      <span className="pr-2 text-sm text-gray-500 ">
                        Description
                      </span>
                      {data?.description}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section
              className={`  h-full rounded-md  font-philosopher max-w-full w-full `}
            >
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
                    onClick={productFormHandler}
                  >
                    {/* <Link to={`/sponsor/profile/${id}/product_form`}> */}
                    <p>
                      <span className="hidden md:inline-block">
                        Add Sponsor Product
                      </span>

                      <IoIosSend className="w-6 h-6 md:hidden" />
                    </p>
                  </button>
                </div>
              </div>
              <section
                className={`w-full overflow-auto   border-2 [&::-webkit-scrollbar]:hidden rounded-lg border-gray-200 shadow-md bg-white`}
              >
                <section className="grid grid-cols-customProduct pb-2 p-2  gap-4   min-w-[1000px] font-medium md:font-semibold bg-white font-mavenPro">
                  <p className="pl-2 md:text-lg">SrNo.</p>

                  {listHeadingProducts.map((heading, index) => (
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
                <div className=" h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[1000px] bg-gray-50">
                  {isError ? (
                    <p className="flex items-center justify-center w-full h-full font-medium text-center text-rose-800">
                      Check Internet connection or Contact to Admin
                    </p>
                  ) : data.products?.length > 0 ? (
                    currentSponsorCompanyProducts?.map(
                      (product: sponsorProductsType, i: number) => (
                        <section
                          key={i}
                          className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customProduct group hover:bg-gray-50"
                        >
                          <span>{i + 1}</span>

                          <span
                            className={`  font-semibold text-center  rounded-full  `}
                          >
                            {product?.name}
                          </span>

                          <div className="flex items-center justify-center">
                            {product?.image ? (
                              <img
                                src={product?.image}
                                alt="product Image"
                                className="object-contain w-24 h-24 rounded-lg"
                              />
                            ) : (
                              <span className="text-sm font-bold text-gray-400">
                                No Image
                              </span>
                            )}
                          </div>

                          <span className="flex justify-center ml-4 text-sm font-semibold ">
                            {product?.description || "--"}
                          </span>
                          <span className="flex justify-center ml-2 text-sm font-semibold ">
                            {product?.sponsorname || "---"}
                          </span>
                          <span
                            onClick={() =>
                              product?.link && handleLinkClick(product.link)
                            }
                            className={`ml-2 text-sm font-semibold text-center ${
                              product?.link
                                ? "hover:underline hover:text-sky-400 "
                                : ""
                            } break-words break-all cursor-pointer `}
                          >
                            {product?.link ? "Official site" : "----"}
                          </span>
                          <ConfirmationDialog
                            show={dialogCrendial.showDialog}
                            onClose={handleCloseDialog}
                            onConfirm={handleConfirmRedirect}
                          />
                          <span className="flex justify-center ml-2 text-sm font-semibold ">
                            {product?.active === true ? "Active" : "not Active"}
                          </span>
                          {/* <span className="flex justify-center ml-2 text-sm font-semibold ">
                        {product?.products.length || 0}
                      </span> */}

                          <div className="grid justify-center gap-2">
                            <button
                              className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb]"
                              onClick={() => updateproduct(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-rose-600 hover:bg-rose-700"
                              onClick={() => deletproduct(product._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </section>
                      )
                    )
                  ) : (
                    <p className="flex items-center justify-center w-full h-full">
                      Add products
                    </p>
                  )}
                </div>
              </section>
              <Pagination<sponsorProductsType>
                currentPage={currentPage}
                apiData={data?.products}
                itemsPerPage={itemsPerPage}
                handleClick={handleClick}
              />
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default SponsorCompanyProfile;
