import { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { VideoCategorys } from "../types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/loader";
import uploadVideo from "../firebase_video/video";
import { TiArrowBackOutline } from "react-icons/ti";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { FaCaretDown, FaRegImage } from "react-icons/fa";
import uploadImage from "../firebase_image/image";
import TextEditor from "../components/textEditor";

interface stateProps {
  title: string;
  slug: string;
  category: string;
  url: string;
  tags: string[];
  description: string;
  thumnail: string;
  imageTitle: string;
}
const UploadVideo = () => {
  const { id } = useParams();

  const [updatePost] = useUpdatePostMutation();

  const { data, isError } = useGetDataQuery({
    url: `/video/get-video-byid/${id}`,
  });

  const [progressStatus, setProgressStatus] = useState<number | null>(null);

  const { data: categoryData, isLoading: isLoadingCategory } = useGetDataQuery({
    url: "/video/get-category",
  });

  const [state, setState] = useState<stateProps>({
    title: "",
    slug: "",
    category: "",
    url: "",
    tags: [],
    description: "",
    thumnail: "",
    imageTitle: "",
  });
  const navigate = useNavigate();
  const makeSlug = (value: string) => {
    return value.toLowerCase().replace(/\s+/g, "-");
  };

  const isUpdate = Object.keys(data || [])?.length !== 0;
  console.log(
    data,
    state,
    "update value",
    isUpdate && !isError ? "PUT" : "POST"
  );

  useEffect(() => {
    if (isUpdate && !isError) {
      setState({
        title: data?.title,
        slug: data?.slug,
        category: data?.category,
        url: data?.url,
        tags: data?.tags,
        description: data?.dectription,
        thumnail: data?.thumnail,
        imageTitle:
          data?.thumnail?.slice(72, data?.thumnail?.indexOf("%2F")) || "",
      });
    }
  }, [isUpdate, isError, data]);

  const [isOpen, setOpen] = useState({
    category: false,
  });

  const HandleChange = (name: string, value: string) => {
    console.log(name, value);
    if (name === "title") {
      setState((prev) => ({ ...prev, [name]: value, slug: makeSlug(value) }));
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title") {
      setState((prev) => ({ ...prev, [name]: value, slug: makeSlug(value) }));
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const selectOption = (field: string, value: string) => {
    console.log(value);
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
    setOpen((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const [external, setExternal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progressVideoStatus, setProgressVideoStatus] = useState<number | null>(
    null
  );
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      try {
        const videourl = await uploadVideo(
          file.name,
          file,
          setProgressVideoStatus
        );

        setState((prev) => ({ ...prev, url: videourl }));
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading Video");
      }
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      try {
        const imageUrl = await uploadImage(
          selectedFile.name,
          selectedFile,
          setProgressStatus
        );
        setState({
          ...state,
          thumnail: imageUrl,
          imageTitle: selectedFile.name,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(state);
    toast.loading("Checking Details for video");
    try {
      const payload = {
        title: state.title,
        slug: state.slug,
        category: state.category,
        url: state.url,
        tags: state.tags,
        description: state.description,
        thumnail: state.thumnail,
      };
      const response = await updatePost({
        data: payload,
        method: isUpdate && !isError ? "PUT" : "POST",

        path: isUpdate && !isError ? `/video/update/${id}` : `/video/upload`,
      });

      if (response?.data?.success) {
        toast.dismiss();
        toast.success(response?.data?.message, {
          autoClose: 3000,
        });

        clearhandler();
      } else {
        toast.dismiss();
        toast.error("Failed to Uploade Video");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred");
    }
  };

  const clearhandler = () => {
    setState({
      title: "",
      slug: "",
      category: "",
      url: "",
      tags: [],
      description: "",
      thumnail: "",
      imageTitle: "",
    });

    navigate("/videos");
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !state.tags.includes(newTag)) {
        setState((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      e.currentTarget.value = "";
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setState((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  console.log(data, "for category");
  return (
    <div className="w-full md:px-4 md:ml-4 md:pl-0">
      <ToastContainer />
      {isLoadingCategory && <Loader />}
      <form
        className="w-full h-[calc(100vh-6rem)] overflow-hidden   rounded-md"
        onSubmit={submitHandler}
      >
        <div className="flex-1 h-full p-6 rounded font-montserrat">
          <div className="flex pb-2">
            <h2 className="md:text-4xl text-[28px] font-bold text-gray-500 font-mavenPro">
              Video Form
            </h2>
            <div onClick={clearhandler}>
              <TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" />
            </div>
          </div>
          <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto   [&::-webkit-scrollbar]:hidden font-mavenPro">
            <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
              <input
                value={state?.title}
                type="text"
                onChange={handleChange}
                name="title"
                className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                placeholder="Video Title"
                required
              />

              {/* Category Dropdown */}
              <div className="relative">
                <div
                  className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-green-100 border-transparent rounded-md cursor-pointer focus:border-blue-200"
                  onClick={() =>
                    setOpen({ ...isOpen, category: !isOpen.category })
                  }
                >
                  {state.category !== "" ? state.category : "Select Category"}
                  <FaCaretDown className="m-1" />
                </div>
                <ul
                  className={`mt-2 p-2 rounded-md w-32 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${
                    isOpen.category ? "max-h-60" : "hidden"
                  } custom-scrollbar`}
                >
                  {categoryData?.map((video: VideoCategorys, i: number) => (
                    <li
                      key={i}
                      className={`p-2 mb-2 text-sm text-[#DEE1E2]  rounded-md cursor-pointer hover:bg-blue-200/60 ${
                        state.category === video?.category ? "bg-rose-600" : ""
                      }`}
                      onClick={() => selectOption("category", video?.category)}
                    >
                      <span>{video?.category}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* <textarea
              value={companiesData.discription}
              onChange={handleChange}
              name="discription"
              className="w-full h-24 py-4 pl-4 font-medium bg-green-100 border border-transparent border-gray-400 rounded-md outline-none md:col-span-2 focus:border-blue-200 "
              placeholder="Write Details"
              required
            /> */}
              <div className="flex w-full col-span-1 gap-5 md:col-span-2 ">
                <TextEditor
                  value={state?.description}
                  OnChangeEditor={(e: string) => HandleChange("description", e)}
                />
                {/* <ReactQuill
                  theme="snow"
                  value={state?.description}
                  onChange={(content: string) =>
                    HandleChange("description", content)
                  }
                  className="w-full bg-green-100 border-none rounded-md "
                /> */}
              </div>
              {/* <input
                value={state?.tags}
                type="text"
                onChange={handleChange}
                name="tags"
                className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                placeholder="Add Tags"
                required
              /> */}

              {/* add tags */}
              <div className="">
                <input
                  type="text"
                  onKeyDown={handleTagInput}
                  className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200"
                  placeholder="Add Tags (press Enter or comma to add)"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {state.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-2 text-xs font-bold"
                        onClick={() => handleTagRemove(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full col-span-1 md:col-span-2">
                <div className="flex w-full gap-2 mb-2">
                  <label htmlFor="" className="mb-1 font-medium text-gray-500">
                    External URL
                  </label>
                  <input
                    checked={external}
                    onClick={() => setExternal(!external)}
                    className="  rounded-[7px] outline-none border border-transparent bg-green-100 focus:border-blue-200"
                    type="checkbox"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {external ? (
                    <>
                      {/* <label htmlFor="">URL:</label> */}
                      <input
                        value={state?.url}
                        name="url"
                        onChange={handleChange}
                        className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200"
                        type="url"
                        placeholder="Video URL"
                      />
                    </>
                  ) : (
                    <div>
                      <label className="ml-1 font-medium text-gray-500 ">
                        Upload Video
                      </label>
                      <input
                        ref={fileInputRef}
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="w-full h-[40px] mt-2 p-1 rounded-[7px] outline-none border border-transparent bg-green-100 focus:border-blue-200"
                        type="file"
                      />
                      {progressVideoStatus !== null &&
                        progressVideoStatus !== 0 && (
                          <>
                            <div className="inset-0 z-10 flex flex-row items-end gap-2 pt-2">
                              <p className="text-black text-[12px]">
                                uploading
                              </p>
                              <div
                                className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"
                                style={{ width: `${progressVideoStatus}%` }}
                              ></div>
                            </div>
                          </>
                        )}
                    </div>
                  )}
                  {state?.url ? (
                    <ReactPlayer
                      url={state?.url}
                      width="100%"
                      height="200px"
                      controls
                    />
                  ) : (
                    <div className="w-full h-[200px] gap-4 bg-blue-50 flex justify-center items-center text-gray-500 font-semibold text-xl">
                      <MdOutlineOndemandVideo className="w-12 h-12" />
                      <span className="w-[180px]">
                        Video will play here after uploade
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 col-span-1 gap-4 md:grid-cols-2 md:col-span-2">
                <div className="relative w-full ">
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`px-4 py-2 pl-24 relative ${
                      progressStatus ? "pb-2" : ""
                    } w-full text-base bg-green-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}
                  >
                    <p
                      className={`font-medium ${
                        state.imageTitle && "text-gray-700"
                      }`}
                    >
                      {state.imageTitle || "Choose a file"}
                    </p>

                    <span className="text-gray-500 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-green-200">
                      Browse
                    </span>
                  </label>
                  {progressStatus !== null && progressStatus !== 0 && (
                    <>
                      <div className="absolute left-0 right-0 top-20%  z-10 flex items-end">
                        <div
                          className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"
                          style={{ width: `${progressStatus}%` }}
                          // style={{ width: `${100}%` }}
                        ></div>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-white h-[200px] bg-blue-50 rounded-md ">
                  {state.thumnail ? (
                    <img
                      src={state?.thumnail}
                      alt={state?.title}
                      className="rounded-[5px] object-contain w-full h-full"
                    />
                  ) : (
                    <p className="flex items-center justify-center w-full h-full gap-4 p-4 text-sm">
                      <FaRegImage className="w-16 h-12 text-gray-500" />
                      <span className="text-xl font-medium text-gray-500 w-[180px]">
                        Here Uploade Image will be shown
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex">
              <button
                className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb] "
                type="submit"
                // disabled={isError}
              >
                {isUpdate && !isError ? "Update" : "Submit"}
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
};
export default UploadVideo;
