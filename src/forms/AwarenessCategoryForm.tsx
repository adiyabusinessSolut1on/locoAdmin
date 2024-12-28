import { useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import { useUpdatePostMutation } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMediaUrl } from "../utils/getMediaUrl";
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

const AwarenessCategoryForm = ({ isCategoryForm, setCategoryForm, singleCategory, }: Props) => {
  const [imagePreview, setImagePreview] = useState<string | any>()
  const [categoryDataForm, setCategoryDataForm] = useState<any>({
    categoryName: singleCategory?.name ? singleCategory.name : "",
    image: singleCategory?.image ? singleCategory?.image : ""
  });
  const [updatePost] = useUpdatePostMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryDataForm((prev: any) => ({
      ...prev,
      [e?.target?.name]:
        e?.target?.type === "checkbox" ? e?.target?.checked : e?.target?.value,
    }));
  };

  const submiteHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // console.log(categoryDataForm);
    try {
      // const payload = {
      //   name: categoryDataForm?.categoryName,
      //   image: categoryDataForm?.image
      // };

      const formData = new FormData()
      formData.append("name", categoryDataForm?.categoryName)
      formData.append("image", categoryDataForm?.image)

      const response = await updatePost({
        data: formData,
        method: isCategoryForm.creat ? "POST" : "PUT",
        path: isCategoryForm.creat ? "/awareness/category/create" : `/awareness/category/${isCategoryForm.updateId}`,
      }).unwrap()
      // console.log("respones: ", response);

      if (response?.success) {
        toast.dismiss();
        toast.success(response?.message, { autoClose: 5000, });
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
      image: ""
    });
    // console.log(categoryDataForm);
  };
  // const [progressStatus, setProgressStatus] = useState<number | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      try {
        setImagePreview(URL.createObjectURL(selectedFile));
        setCategoryDataForm((prev: any) => ({
          ...prev,
          image: selectedFile,
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center px-4 sm:px-0 bg-black/40" onClick={closeHandler}>
      <ToastContainer />
      <div className="bg-white rounded-md w-[400px]" onClick={(e) => e.stopPropagation()}>
        <form className="" onSubmit={submiteHandler}>
          {/* left section */}
          <div className="p-6 px-8 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className=" md:text-4xl text-[28px] font-bold text-gray-700 font-mavenPro">Category Form</h2>
              <button onClick={closeHandler}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 hover:text-orange-600 text-sky-600" />
              </button>
            </div>

            <div className="items-center flex flex-col h-full gap-4 py-4 sm:flex ">
              <div className="w-full font-mavenPro">
                <input value={categoryDataForm?.categoryName} type="text" onChange={handleChange} name="categoryName" className={" font-medium outline-none w-full  border h-10 border-gray-400 rounded-md pl-4 focus-within:border-blue-400  "} placeholder={"Category Name"} required />
              </div>

              <div className="relative w-full h-full">
                <input type="file" name="image" onChange={handleImageChange} className="hidden" id="file-upload" />

                <label htmlFor="file-upload" className={`px-4 py-1 pl-24 relative w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}>
                  <p className={`${categoryDataForm?.image ? "text-gray-700" : "text-gray-400"}`}>{"Choose a file"}</p>
                  <span className="text-gray-400 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-blue-200">Browse</span>
                </label>

                {/* {progressStatus !== null && progressStatus !== 0 && (
                  <>
                    <div className="absolute inset-0 z-10 flex items-end">
                      <div className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]" style={{ width: `${progressStatus}%` }}></div>
                    </div>
                  </>
                )} */}
              </div>
              {imagePreview ? <img src={imagePreview} className="h-20 w-20" alt="" /> : categoryDataForm?.image && <img src={getMediaUrl(categoryDataForm?.image, "awarenessCategory")} className="h-20 w-20" alt="" />}
            </div>

            <div className="flex ">
              <button className="px-4 py-2 text-white bg-[#1f3c88] rounded hover:bg-[#2950b1]" type="submit">{isCategoryForm.creat ? "Submit" : "Update"}</button>
              <button className="px-4 py-2 ml-8 text-white bg-red-500 rounded hover:bg-red-400" onClick={closeHandler}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AwarenessCategoryForm;
