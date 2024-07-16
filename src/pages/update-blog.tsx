import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import Loader from "../components/loader";
import uploadImage from "../firebase_image/image";
import TextEditor from "../components/textEditor";
const UpdateBlog = () => {
  const [updatePost] = useUpdatePostMutation();

  const { id } = useParams();
  const { data, isLoading } = useGetDataQuery({
    url: `/blog/get-blog-using-Id/${id}`,
  });
  const [state, setState] = useState({
    title: "",
    thumnail: "",
    slug: "",
    content: "",
  });
  console.log("data of single Blog>>", data);
  useEffect(() => {
    setState({
      title: data?.data?.title,
      thumnail: data?.data?.thumnail,
      slug: data?.data?.slug,
      content: data?.data?.content,
    });
  }, [data]);

  const makeSlug = (value: string) => {
    return value.toLowerCase().replace(/\s+/g, "-");
  };
  const handleChanges = (name: string, value: string) => {
    if (name === "title") {
      setState({ ...state, [name]: value, slug: makeSlug(value) });
    } else {
      setState({ ...state, [name]: value });
    }
  };
  const [progressStatus, setProgressStatus] = useState<number | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      try {
        const imageUrl = await uploadImage(
          selectedFile.name,
          selectedFile,
          setProgressStatus
        );
        setState({ ...state, thumnail: imageUrl });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };
  const HandleUpdate = useCallback(async () => {
    console.log(state);
    try {
      const response = await updatePost({
        path: `/blog/update-blog/${id}`,
        data: state,
      });
      if (response?.data?.success) {
        toast.success(response?.data?.message, {
          autoClose: 3000,
        });

      } else {
        toast.error("Failed to Update main category");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  }, [id, state, updatePost]);
  return (
    <div className="p-5  w-full bg-[#e7e5e592]">
      {isLoading && <Loader />}
      <ToastContainer />
      <div className="flex flex-col gap-5 border border-[#8d8787f5] p-10 rounded-[7px]">
        <div className="flex flex-col w-full gap-1">
          <label>Title</label>
          <input
            value={state?.title}
            onChange={(e) => handleChanges("title", e.target.value)}
            type="text"
            className="border border-[#b9b4b4da] bg-[#e7e5e592] outline-none p-1 rounded-[7px]"
          />
        </div>
        <div className="relative flex flex-row gap-5 mb-6 outline-none ">
          <div className="w-full ">
            <label className="block mb-2 font-semibold text-gray-700">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border-[#b9b4b4da] bg-[#e7e5e592] p-3 border outline-none  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {progressStatus !== null && progressStatus !== 0 && (
              <>
                <div className="inset-0 z-10 flex flex-row items-end gap-2 pt-2">
                  <p className="text-black text-[12px]">uploading</p>
                  <div
                    className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"
                    style={{ width: `${progressStatus}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>
          {state?.thumnail && (
            <img
              src={state?.thumnail}
              alt={state?.title}
              className="rounded-[5px] max-w-[300px] max-h-[200px]"
            />
          )}
        </div>

        <TextEditor
          value={state?.content}
          OnChangeEditor={(e: string) => handleChanges("content", e)}
        />
        <div className="flex justify-center w-full text-center ">
          <button
            disabled={!state?.title && !state?.thumnail && !state?.content}
            onClick={HandleUpdate}
            className={`${
              state?.title && state?.thumnail && state?.content
                ? "bg-[#5a83bd]"
                : "bg-gray-500"
            }  px-3 mt-8 py-1 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
          >
            update
          </button>
        </div>
      </div>
    </div>
  );
};
export default UpdateBlog;
