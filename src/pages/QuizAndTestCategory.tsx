import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useGetDataQuery, useDeletePostMutation } from "../api";
import { VideoCategorys } from "../types";
import Loader from "../components/loader";
import Pagination from "../components/pagination/Pagination";
import ConfirmDeleteModal from "../components/modal/DeleteModal";
import QuizAndTestCategoryForm from "../forms/QuizAndTestCategoryForm";

const QuizAndTestCategory = () => {
  const { data, isLoading } = useGetDataQuery({ url: "/video/get-category", });

  const [isCategoryForm, setCategoryForm] = useState({
    creat: false,
    updateId: "",
  });
  const [updateData, setUpdateDate] = useState({
    name: "",
    image: "",
  });
  const [isModalOpen, setModalOpen] = useState({
    condition: false,
    id: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice data for the current page
  const currentCategory = data?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const [deletPost] = useDeletePostMutation();

  const handlingCategory = () => {
    setCategoryForm((prev) => ({
      ...prev,
      creat: !prev.creat,
    }));
    setUpdateDate({
      name: "",
      image: "",
    });
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

  const updateCategory = (category: VideoCategorys) => {
    setCategoryForm((prev) => ({
      ...prev,
      updateId: category?._id,
    }));

    setUpdateDate({
      name: category.category,
      image: category.image || "",
    });
  };

  const handleConfirmDelete = () => {
    toast.loading("Checking details...");
    deletPost({ url: `/video/delete-category/${isModalOpen.id}`, }).then((res) => {
      if (res.data.success) {
        toast.dismiss();
        toast.success(`${res.data.message}`);
      }
    }).catch(() => {
      toast.dismiss();
      toast.error("Failed to delete category");
    });
    setModalOpen({
      condition: false,
      id: "",
    });
  };

  const categoryHeading = ["Category Name", "Setting"];

  return (
    <React.Fragment>
      {isLoading && <Loader />}
      <ToastContainer />
      <>
        {(isCategoryForm.creat || isCategoryForm.updateId) && (
          <QuizAndTestCategoryForm isCategoryForm={isCategoryForm} setCategoryForm={setCategoryForm} singleCategory={updateData} />
        )}

        {isModalOpen.condition && (<ConfirmDeleteModal onClose={handleCloseModal} onConfirm={handleConfirmDelete} />)}
        <section className="p-4 h-full w-full mx-auto">
          <section className="p-6 h-full text-gray-600 border-gray-200 rounded-md max-w-full">
            <div className="flex items-center mb-6">
              <h1 className="text-4xl font-bold">Quiz and Test Category</h1>
            </div>
            <div className="flex justify-between mb-4">
              <input type="search" placeholder="Search" className="p-2 text-base border-2 bg-slate-50 shadow-inner rounded" />
              <button className="px-2 py-1 bg-[#1f3c88] hover:bg-[#2d56bb] text-white } rounded shadow-xl md:px-4 md:py-2 sm:self-center" onClick={handlingCategory}>Create Category</button>
            </div>

            <section className="w-full overflow-auto rounded-lg shadow-md bg-white">
              <section className="grid gap-4 p-2 pb-2 grid-cols-3 font-medium bg-white">
                <p>SrNo.</p>
                {categoryHeading.map((heading, index) => (
                  <p key={index} className="text-center">{heading}</p>
                ))}
              </section>

              <div className="h-96 overflow-y-auto bg-gray-50">
                {currentCategory.map((category: VideoCategorys, i: number) => (
                  <section key={category._id} className="grid items-center gap-4 py-2 pl-6 pr-4 border-t-2 grid-cols-3">
                    <span>{indexOfFirstItem + i + 1}</span>
                    <span>{category.category}</span>
                    <div className="flex justify-center gap-4">
                      <button className="px-3 text-sm py-2 text-white  rounded-md bg-[#1f3c88] hover:bg-[#2d56bb]" onClick={() => updateCategory(category)}>Edit</button>
                      <button className="px-3 py-2 text-sm text-white rounded-md bg-rose-600 hover:bg-rose-700" onClick={() => deletCategory(category._id)}>Delete</button>
                    </div>
                  </section>
                ))}
              </div>
            </section>
            <Pagination currentPage={currentPage} apiData={data} itemsPerPage={itemsPerPage} handleClick={handleClick} />
          </section>
        </section>
      </>
    </React.Fragment>
  );
};

export default QuizAndTestCategory;
