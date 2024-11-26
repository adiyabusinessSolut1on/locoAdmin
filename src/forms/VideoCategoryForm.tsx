import React, { useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import { useUpdatePostMutation } from "../api";
import { toast, ToastContainer } from "react-toastify";
interface CategoryForm {
  creat: boolean;
  updateId: string;
}
interface Props {
  isCategoryForm: {
    creat: boolean;
    updateId: string;
  };
  setCategoryForm: React.Dispatch<React.SetStateAction<CategoryForm>>;
  singleCategory: {
    name: string;
    image: string;
  };
}

const VideoCategoryForm = ({
  isCategoryForm,
  setCategoryForm,
  singleCategory,
}: Props) => {
  const [categoryDataForm, setCategoryDataForm] = useState({
    categoryName: singleCategory.name ? singleCategory.name : "",
  });

  const [updatePost] = useUpdatePostMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryDataForm((prev) => ({
      ...prev,
      [e?.target?.name]:
        e?.target?.type === "checkbox" ? e?.target?.checked : e?.target?.value,
    }));
  };

  const submiteHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(categoryDataForm);
    try {
      const payload = {
        category: categoryDataForm?.categoryName,
      };

      console.log(payload, isCategoryForm.creat);

      const response = await updatePost({
        data: payload,
        method: isCategoryForm.creat ? "POST" : "PUT",
        path: isCategoryForm.creat
          ? `/video/create-category`
          : `/video/update-category/${isCategoryForm.updateId}`,

        //   "/awareness/category/create"
        //   : `/awareness/category/${isCategoryForm.updateId}`,
      });
      console.log(response);
      if (response?.data?.success) {
        toast.dismiss();
        toast.success(response?.data?.message, {
          autoClose: 5000,
        });
        closeHandler();
      } else {
        toast.dismiss();
        toast.error("Failed to create main category");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error creating main category:", error);
      toast.error("An error occurred");
    }
  };

  const closeHandler = () => {
    if (isCategoryForm.creat) {
      setCategoryForm((prev) => ({
        ...prev,
        creat: !prev.creat,
      }));
    } else {
      setCategoryForm((prev) => ({
        ...prev,
        updateId: "",
      }));
    }

    setCategoryDataForm({
      categoryName: "",
    });
    console.log(categoryDataForm);
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center px-4 sm:px-0 bg-black/40"
      onClick={closeHandler}
    >
      <ToastContainer />
      <div
        className="bg-white rounded-md w-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="" onSubmit={submiteHandler}>
          {/* left section */}
          <div className="p-6 px-8 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className=" md:text-4xl text-[28px] font-bold text-gray-700 font-mavenPro">
                Video Category Form
              </h2>
              <button onClick={closeHandler}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 hover:text-orange-600 text-sky-600" />
              </button>
            </div>
            <div className="items-center h-full gap-4 py-4 sm:flex ">
              <div className="w-full font-mavenPro">
                <input
                  value={categoryDataForm?.categoryName}
                  type="text"
                  onChange={handleChange}
                  name="categoryName"
                  className={
                    " font-medium outline-none w-full  border h-10 border-gray-400 rounded-md pl-4 focus-within:border-blue-400  "
                  }
                  placeholder={"Category Name"}
                  required
                />
              </div>
            </div>

            <div className="flex ">
              <button
                className="px-4 py-2 text-white bg-[#1f3c88] rounded hover:bg-[#2950b1]"
                type="submit"
              >
                {/* Save Changes */}
                {isCategoryForm.creat ? "Submit" : "Update"}
              </button>
              <button
                className="px-4 py-2 ml-8 text-white bg-red-500 rounded hover:bg-red-400"
                onClick={closeHandler}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoCategoryForm;
