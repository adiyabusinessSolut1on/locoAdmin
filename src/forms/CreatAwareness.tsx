import { useEffect, useState } from "react";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import uploadImage from "../firebase_image/image";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaCaretDown } from "react-icons/fa";
import { awarenessCategoryType } from "../types";
// import TextEditor from "../components/textEditor";
import { TiArrowBackOutline } from "react-icons/ti";
import JoditTextEditor from "../components/editorNew";
import { getMediaUrl } from "../utils/getMediaUrl";

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

  const [imgPreview, setImgPreview] = useState<any>()
  const [state, setState] = useState<StateProps | any>({
    category: {
      name: updateAwar?.category || "",
      id: "",
    },
    title: updateAwar?.title || "",

    thumnail: getMediaUrl(updateAwar?.image, "awareness") || "",
    imageSrc:
      updateAwar?.image?.substring(
        updateAwar?.image?.lastIndexOf("%"),
        updateAwar?.image?.lastIndexOf("/") + 1
      ) || "",
    content: updateAwar?.description || "",
  });

  useEffect(() => {
    if (isUpdate && !isErrorAwar) {
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
    setImgPreview(getMediaUrl(updateAwar?.image, "awareness"))
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
      setImgPreview(URL.createObjectURL(selectedFile))
      setState({ ...state, thumnail: selectedFile });
    }
  };

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Checking Details");
    try {
      // const payload = {
      //   title: state?.title,
      //   image: state?.thumnail,
      //   category: state.category.name,
      //   description: state?.content,
      // };

      const formData = new FormData()
      formData.append("title", state.title)
      formData.append("image", state.thumnail)
      formData.append("category", state.category.name)
      formData.append("description", state.content)
      const response = await updatePost({
        data: formData,
        method: isUpdate && !isErrorAwar ? "PUT" : "POST",
        path:
          isUpdate && !isErrorAwar ? `/awareness/${id}` : "/awareness/create",
      }).unwrap()
      // console.log(response);
      if (response?.success) {
        toast.dismiss();
        toast.success(response?.message, {
          autoClose: 5000,
        });
        clearhandler();
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
      <form className="w-full h-[calc(100vh-6rem)] overflow-hidden   rounded-md" onSubmit={handleSubmit}>
        <div className="flex-1 h-full p-6 rounded font-montserrat">
          <div className="flex pb-2">
            <h2 className="md:text-4xl text-[28px] font-bold text-gray-500 font-mavenPro">{`${isUpdate ? "Update" : "Creat"} Awareness Form`}</h2>
            <div onClick={clearhandler}>
              <TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" />
            </div>
          </div>

          <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
            <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
              <input value={state?.title} onChange={(e) => handleChange("title", e.target.value)} type="text" placeholder="Enter Title" className="w-full h-10 pl-4 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 " required />

              <div className="relative w-full h-full">
                <input type="file" name="image" onChange={handleImageChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className={`px-4 py-2 pl-24 relative ${progressStatus ? "pb-2" : ""} w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}>
                  <p className={`font-medium ${imgPreview && "text-gray-700"}`}>{imgPreview || "Choose a file"}</p>

                  <span className="text-gray-400 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-blue-200">Browse</span>
                </label>
                {progressStatus !== null && progressStatus !== 0 && (
                  <>
                    <div className="absolute inset-0 z-10 flex items-end">
                      <div className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]" style={{ width: `${progressStatus}%` }}></div>
                    </div>
                  </>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <div className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-blue-100 border-transparent rounded-md cursor-pointer focus:border-blue-200" onClick={() => setOpen((prev) => !prev)}>
                  <span className={`font-medium  ${state?.category?.name ? "text-gray-700" : "text-gray-400"}`}>
                    {state?.category?.name !== "" ? state?.category?.name : "Select Category"}</span>

                  <FaCaretDown className="m-1" />
                </div>
                <ul className={`mt-2 p-2 rounded-md min-w-32 overflow-auto text-[#DEE1E2]  bg-gray-800 shadow-lg absolute z-10 ${isOpen ? "max-h-60" : "hidden"} custom-scrollbar`}>
                  {data?.data?.length > 0 ? (
                    data?.data?.map(
                      (category: awarenessCategoryType, i: number) => (
                        <li key={i} className={`p-2 ${data.length > 1 ? "mb-2" : ""} text-sm font-medium rounded-md cursor-pointer flex items-center gap-2 hover:bg-blue-200/60 ${state?.category?.name === category?.name ? "bg-rose-600" : ""}`}
                          onClick={() =>
                            handleChange("category", {
                              name: category?.name,
                              id: category?._id,
                            })
                          }
                        >
                          {category?.name}
                        </li>
                      )
                    )
                  ) : (
                    <li> Category not Found</li>
                  )}
                </ul>
              </div>
              {/* <div className="md:col-span-2">
                <ReactQuill
                  theme="snow"
                  value={state?.content}
                  onChange={(content: string) =>
                    handleChange("content", content)
                  }
                  className="h-60  rounded-[7px] bg-blue-100 "
                />
              </div> */}
              <div className="md:col-span-2">
                <JoditTextEditor value={state?.content} OnChangeEditor={(e: string) => handleChange("content", e)} />

              </div>
            </div>

            <div className="flex">
              <button className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb] disabled:bg-gray-400" type="submit" disabled={!state?.thumnail || !state?.category.name || !state?.title || !state?.content}>
                {isUpdate ? "Update" : "Submit"}
              </button>
              <button className="px-4 py-2 ml-8 text-white rounded-md bg-rose-600 hover:bg-rose-700" type="button" onClick={clearhandler}>Cancel</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatAwareness;
