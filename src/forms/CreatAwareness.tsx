import { useEffect, useState } from "react";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import uploadImage from "../firebase_image/image";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactQuill from "react-quill";
import { FaCaretDown } from "react-icons/fa";
import { awarenessCategoryType } from "../types";
import { TiArrowBackOutline } from "react-icons/ti";

interface StateProps {
  category: CategoryType;
  title: string;

  thumnail: string;
  imageSrc: string;
  content: string;
}

interface CategoryType {
  id: string;
  name: string;
}

const CreatAwareness = () => {
  //   const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();

  const { id } = useParams();
  const { data: updateAwar, isError: isErrorAwar } = useGetDataQuery({
    url: `/awareness/${id}`,
  });

  const isUpdate = Object.keys(updateAwar || [])?.length !== 0;

  const { data } = useGetDataQuery({
    url: "/awareness/category",
  });
  console.log("Awareness Category>>>>", data);

  const [state, setState] = useState<StateProps>({
    category: {
      name: updateAwar?.category || "",
      id: "",
    },
    title: updateAwar?.title || "",

    thumnail: updateAwar?.image || "",
    imageSrc:
      updateAwar?.image?.substring(
        updateAwar?.image?.lastIndexOf("%"),
        updateAwar?.image?.lastIndexOf("/") + 1
      ) || "",
    content: updateAwar?.description || "",
  });

  useEffect(() => {
    console.log("i am running");

    if (isUpdate && isErrorAwar) {
      setState({
        category: {
          name: updateAwar?.category,
          id: "",
        },
        title: updateAwar?.title,
        imageSrc: updateAwar?.image?.substring(
          updateAwar?.image?.lastIndexOf("%"),
          updateAwar?.image?.lastIndexOf("/") + 1
        ),
        thumnail: updateAwar?.image,
        content: updateAwar?.description,
      });
    }
  }, [isUpdate, isErrorAwar, updateAwar]);

  const handleChange = (name: string, value: string | CategoryType) => {
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
    setOpen(false);
  };
  const [progressStatus, setProgressStatus] = useState<number | null>(null);

  const [isOpen, setOpen] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      try {
        const imageUrl = await uploadImage(
          selectedFile.name,
          selectedFile,
          setProgressStatus
        );
        console.log(imageUrl, "from url function");
        setState({ ...state, thumnail: imageUrl, imageSrc: selectedFile.name });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Checking Details");
    try {
      const payload = {
        title: state?.title,
        image: state?.thumnail,
        category: state.category.name,
        description: state?.content,
      };

      console.log(payload, "submit");
      const response = await updatePost({
        data: payload,
        method: isUpdate && !isErrorAwar ? "PUT" : "POST",
        path:
          isUpdate && !isErrorAwar ? `/awareness/${id}` : "/awareness/create",
      });
      console.log(response);
      if (response?.data?.success) {
        toast.dismiss();
        toast.success(response?.data?.message, {
          autoClose: 5000,
        });
        navigate("/awareness");
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

  console.log(state);

  const clearhandler = () => {
    setState({
      category: {
        name: "",
        id: "",
      },
      title: "",

      thumnail: "",
      imageSrc: "",
      content: "",
    });

    navigate("/awareness");
  };

  return (
    <div className="w-full md:px-4 md:ml-4 md:pl-0">
      <ToastContainer />
      <form
        className="w-full h-[calc(100vh-6rem)] overflow-hidden   rounded-md"
        onSubmit={handleSubmit}
      >
        <div className="flex-1 h-full p-6 rounded font-montserrat">
          <div className="flex pb-2">
            <h2 className="md:text-4xl text-[28px] font-bold text-gray-500 font-mavenPro">
              {`${isUpdate ? "Update" : "Creat"} Awareness Form`}
            </h2>
            <div onClick={clearhandler}>
              <TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" />
            </div>
          </div>
          <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
            <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
              <input
                value={state?.title}
                onChange={(e) => handleChange("title", e.target.value)}
                type="text"
                placeholder="Enter Title"
                className="w-full h-10 pl-4 font-medium text-gray-700 bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                required
              />

              <div className="relative w-full h-full">
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`px-4 py-2 pl-24 relative ${progressStatus ? "pb-2" : ""
                    } w-full text-base bg-green-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}
                >
                  <p
                    className={`font-medium ${state?.imageSrc && "text-gray-700"
                      }`}
                  >
                    {state?.imageSrc || "Choose a file"}
                  </p>

                  <span className="text-gray-400 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-blue-100">
                    Browse
                  </span>
                </label>
                {progressStatus !== null && progressStatus !== 0 && (
                  <>
                    <div className="absolute inset-0 z-10 flex items-end">
                      <div
                        className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"
                        style={{ width: `${progressStatus}%` }}
                      // style={{ width: `${100}%` }}
                      ></div>
                    </div>
                  </>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <div
                  className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-green-100 border-transparent rounded-md cursor-pointer focus:border-blue-200"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <span
                    className={`font-medium  ${state?.category?.name ? "text-gray-700" : "text-gray-400"
                      }`}
                  >
                    {state?.category?.name !== ""
                      ? state?.category?.name
                      : "Select Category"}
                  </span>

                  <FaCaretDown className="m-1" />
                </div>
                <ul
                  className={`mt-2 p-2 rounded-md w-32 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${isOpen ? "max-h-60" : "hidden"
                    } custom-scrollbar`}
                >
                  {data?.data?.map((category: awarenessCategoryType, i: number) => (
                    <li key={i} className={`p-2 ${data.length > 1 ? "mb-2" : ""} text-sm font-medium rounded-md cursor-pointer flex items-center gap-2 hover:bg-blue-200/60 ${state?.category?.name === category?.name
                      ? "bg-rose-600"
                      : ""
                      }`}
                      onClick={() => handleChange("category", { name: category?.name, id: category?._id, })
                      }
                    >
                      {category?.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2">
                <ReactQuill theme="snow" value={state?.content} onChange={(content: string) => handleChange("content", content)} className="h-60  rounded-[7px] bg-green-100 " />
              </div>
            </div>

            <div className="flex">
              <button
                className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb] disabled:bg-gray-400"
                type="submit"
                disabled={
                  !state?.thumnail ||
                  !state?.category.name ||
                  !state?.title ||
                  !state?.content
                }
              >
                {isUpdate ? "Update" : "Submit"}
              </button>
              <button
                className="px-4 py-2 ml-8 text-white rounded-md bg-rose-600 hover:bg-rose-700"
                type="button"
                onClick={clearhandler}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
  // return (
  //   <div className="w-full p-5 bg-blue-100">
  //     <ToastContainer/>
  //     <button
  //       onClick={() => navigate("/awareness")}
  //       className="bg-[#3d3d3d] text-[#f8f8f8] px-3 py-1 rounded-[7px] text-[14px] font-[600] mb-[10px] hover:bg-[#323131]"
  //     >
  //       View Awareness List
  //     </button>
  //     <form
  //       onSubmit={handleSubmit}
  //       className="flex flex-col gap-5 border bg-white border-[#8d8787f5] p-10 rounded-[7px]"
  //     >
  //       <div className="flex flex-col w-full gap-1">
  //         {/* <label>Title</label> */}
  //         <input
  //           value={state?.title}
  //           onChange={(e) => HandleChange("title", e.target.value)}
  //           type="text"
  //           placeholder="Title"
  //           className="border pl-4 border-[#b9b4b4da] bg-[#e7e5e592] outline-none p-1 rounded-[7px]"
  //         />
  //       </div>
  //       <div className="relative  w-full md:w-[43%]">
  //         <div
  //           className="flex realtive justify-between p-2  pl-4  border rounded-md cursor-pointer   focus:border-[#DEE1E2]  border-[#b9b4b4da] bg-[#e7e5e592] "
  //           onClick={() => setOpen((prev) => !prev)}
  //         >
  //           {state?.category?.name !== "" ? (
  //             state?.category?.name
  //           ) : (
  //             <span className="text-sm font-normal text-gray-400">
  //               Select Category
  //             </span>
  //           )}
  //           <FaCaretDown className="m-1" />
  //         </div>
  //         <ul
  //           className={`mt-2 p-2 rounded-md w-40 [&::-webkit-scrollbar]:hidden overflow-y-scroll  bg-gray-100 shadow-lg absolute z-10 ${
  //             isOpen ? "max-h-40" : "hidden"
  //           } custom-scrollbar`}
  //         >
  //           {data?.map((category:awarenessCategoryType, i:number) => (
  //             <li
  //               key={i}
  //               className={`p-2 ${
  //                 data.length > 1 ? "mb-2" : ""
  //               } text-sm font-medium rounded-md cursor-pointer flex items-center gap-2 hover:bg-blue-200/60 ${
  //                 state?.category?.name === category?.name ? "bg-rose-600" : ""
  //               }`}
  //               onClick={() =>
  //                 HandleChange("category", {
  //                   name: category?.name,
  //                   id: category?._id,
  //                 })
  //               }
  //             >
  //               {category?.name}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //       <div className="relative flex flex-row gap-5 mb-6 outline-none ">
  //         <div className="w-full ">
  //           {/* <label className="block mb-2 font-semibold text-gray-700">
  //             Awareness Image
  //           </label> */}
  //           <input
  //             type="file"
  //             accept="image/*"
  //             onChange={handleImageChange}
  //             className="w-full border-[#b9b4b4da] bg-[#e7e5e592] p-3 border outline-none  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           />
  //           {progressStatus !== null && progressStatus !== 0 && (
  //             <>
  //               <div className="inset-0 z-10 flex flex-row items-end gap-2 pt-2">
  //                 <p className="text-black text-[12px]">uploading</p>
  //                 <div
  //                   className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"
  //                   style={{ width: `${progressStatus}%` }}
  //                 ></div>
  //               </div>
  //             </>
  //           )}
  //         </div>
  //         {state?.thumnail && (
  //           <img
  //             src={state?.thumnail}
  //             alt={state?.title}
  //             className="rounded-[5px] max-w-[300px] max-h-[200px]"
  //           />
  //         )}
  //       </div>
  // <div>
  //   <ReactQuill
  //     theme="snow"
  //     value={state?.content}
  //     onChange={(content: string) => HandleChange("content", content)}
  //     className="h-60  rounded-[7px]"
  //   />
  // </div>
  //       <button
  //         //   onClick={HandleCreate}
  //         type="submit"
  //         disabled={
  //           !state?.thumnail ||
  //           !state?.category.name ||
  //           !state?.title ||
  //           !state?.content
  //         }
  //         className={`${
  //           state?.thumnail &&
  //           state?.category.name &&
  //           state?.title &&
  //           state?.content
  //             ? "bg-[#5a83bd]"
  //             : "bg-gray-500"
  //         } text-center  mt-8 p-1 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
  //       >
  //         save
  //       </button>
  //     </form>
  //   </div>
  // );
};

export default CreatAwareness;
