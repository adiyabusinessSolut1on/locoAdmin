import { useState } from "react";
import AwarenessCategoryForm from "../forms/AwarenessCategoryForm";
import { IoIosSend } from "react-icons/io";
import { useDeletePostMutation, useGetDataQuery } from "../api";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDeleteModal from "../components/modal/DeleteModal";
import Loader from "../components/loader";
import Pagination from "../components/pagination/Pagination";
import { FaCaretDown } from "react-icons/fa";

interface awarenessCategory {
  _id: string;
  name: string;
  image: string;
}
const AwarenessCategory = () => {
  const [isCategoryForm, setCategoryForm] = useState({
    creat: false,
    updateId: "",
  });
  const [updateData, setUpdateDate] = useState({
    name: "",
  });

  const [isOpen, setOpen] = useState(false);
  const [sortElement, setSortElement] = useState("");

  const categoryHeading = ["Category Name", "Setting"];

  const handlingCategory = () => {
    setCategoryForm((prev) => ({
      ...prev,
      creat: !prev.creat,
    }));
    setUpdateDate({
      name: "",
    });
  };

  //   console.log(categorysData);

  const { data, isLoading, isError } = useGetDataQuery({
    url: "/awareness/category",
  });

  console.log("response: ", data?.data);



  const [deletPost] = useDeletePostMutation();

  const [isModalOpen, setModalOpen] = useState({
    condition: false,
    id: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  //calculation of page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentAwarenessCategory = data?.data?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  /*  const currentAwarenessCategory = [
     // Mock data
     { _id: "1", name: "Category 1", image: "image1.jpg" },
     { _id: "2", name: "Category 2", image: "image2.jpg" },
     { _id: "3", name: "Category 3", image: "image3.jpg" },
     //... More categories
   ]; */


  // const sortedAwarCategory = currentAwarenessCategory

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCloseModal = () => {
    setModalOpen({
      condition: false,
      id: "",
    });
  };

  const deletCategory = (id: string) => {
    setModalOpen((prev) => ({
      ...prev,
      condition: !prev.condition,
      id: id,
    }));
  };
  const updateCategory = (category: awarenessCategory) => {
    setCategoryForm((prev) => ({
      ...prev,
      updateId: category?._id,
    }));

    setUpdateDate((prev) => ({
      ...prev,
      name: category?.name,
    }));
  };

  const handleConfirmDelete = () => {
    // Handle the delete action here
    toast.loading("checking Details");
    console.log("Item deleted", isModalOpen.id);
    deletPost({ url: `/awareness/category/${isModalOpen.id}`, }).then((res) => {
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

  const sortElements = ["Oldest", "Latest"];

  const handlingSort = (value: string) => {
    setSortElement(value);
    setOpen(false);
  };

  return (
    <>
      {(isCategoryForm.creat || isCategoryForm.updateId) && (
        <AwarenessCategoryForm singleCategory={updateData} isCategoryForm={isCategoryForm} setCategoryForm={setCategoryForm} />
      )}
      <ToastContainer />
      {isLoading && <Loader />}
      {isModalOpen.condition && (
        <ConfirmDeleteModal onClose={handleCloseModal} onConfirm={handleConfirmDelete} />
      )}
      <section className={`  md:pl-0 p-4 h-full w-full rounded-md   mx-auto [&::-webkit-scrollbar]:hidden `}>
        <section className={` md:p-8 p-6 h-full  text-gray-600  border-gray-200 rounded-md   max-w-full w-full `}>
          <div className="flex items-center mb-2 md:mb-6">
            <h1 className=" text-[28px] font-bold md:text-4xl font-mavenPro ">Awareness Category</h1>
          </div>

          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-4 ">
              <div className={`flex items-center`}>
                <input type="search" placeholder={` Search`}
                  className={` p-2 text-sm md:text-base  sm:px-4 py-1 border-[2px] border-transparent 
                 bg-slate-50 focus:border-gray-100
              shadow-inner rounded-[0.26rem] outline-none `}
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                // onFocus={() => setCurrentPage(1)}
                />
              </div>

              <div className="relative">
                <div
                  className="flex justify-between p-2 font-medium text-gray-600 border-transparent rounded-md cursor-pointer hover:bg-gray-200 focus:border-blue-200"
                  onClick={() => setOpen(!isOpen)}
                >
                  {sortElement !== "" ? sortElement : "Select Sort"}
                  <FaCaretDown
                    className={`m-1 transition-all duration-300 ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </div>
                <ul
                  className={`mt-2 p-2 rounded-md w-32 text-white bg-gray-800 shadow-lg absolute z-10 ${isOpen ? "max-h-60" : "hidden"
                    } custom-scrollbar`}
                >
                  {sortElements.map((sortEl: string, i: number) => (
                    <li
                      key={i}
                      className={`p-2 mb-2 text-sm text-white  rounded-md cursor-pointer hover:bg-blue-200/60 ${sortElement === sortEl ? "bg-rose-400" : ""
                        }`}
                      onClick={() => handlingSort(sortEl)}
                    >
                      <span>{sortEl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative flex items-center self-end ">
              <button
                className={` px-2 py-1 
                         bg-[#1f3c88] hover:bg-[#2d56bb] text-white
                    }    rounded shadow-xl md:px-4 md:py-2  sm:self-center`}
                onClick={handlingCategory}
              >
                <span className="hidden md:inline-block">Creat Category</span>

                <IoIosSend className="w-6 h-6 md:hidden" />
              </button>
            </div>
          </div>
          <section
            className={`w-full overflow-auto   border-2 [&::-webkit-scrollbar]:hidden rounded-lg  shadow-md bg-white`}
          >
            {/* min-w-[900px] */}
            <section className="grid gap-4 p-2 pb-2 min-w-[800px] font-medium border-gray-100 grid-cols-customeCategory md:font-semibold font-mavenPro bg-white">
              <p className="pl-2 text-gray-600 md:text-lg">SrNo.</p>
              {/* <p className="pl-10 text-gray-600 md:text-lg">Logo</p> */}

              {categoryHeading.map((heading, index) => (
                <p
                  key={index}
                  className={`  text-gray-600 md:text-lg ${index !== 0 ? "justify-self-center" : "ml-6"
                    }`}
                >
                  {heading.charAt(0).toUpperCase() + heading.slice(1)}
                </p>
              ))}
            </section>
            {/* min-w-[900px] */}
            <div className=" h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[800px] bg-gray-50">
              {isLoading ? (
                <p>Loading...</p>
              ) : isError ? (
                <p className="flex items-center justify-center w-full h-full font-medium text-center text-rose-800">Check Internet connection or Contact to Admin</p>
              ) : data?.data?.length > 0 ? (
                currentAwarenessCategory?.map((category: awarenessCategory, i: number) => (
                  <section key={i} className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customeCategory group hover:bg-gray-50">
                    <span>{i + 1}</span>

                    <span className="ml-2 text-sm font-semibold text-gray-600 md:text-base">{category?.name}</span>

                    <div className="flex justify-center gap-4">
                      <button className="px-3 text-sm py-2 text-white  rounded-md bg-[#1f3c88] hover:bg-[#2d56bb]" onClick={() => updateCategory(category)}>Edit</button>
                      <button className="px-3 py-2 text-sm text-white rounded-md bg-rose-600 hover:bg-rose-700" onClick={() => deletCategory(category?._id)}>Delete</button>
                    </div>
                  </section>
                )
                )
              ) : (
                <div>No Data Found</div>
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

export default AwarenessCategory;
