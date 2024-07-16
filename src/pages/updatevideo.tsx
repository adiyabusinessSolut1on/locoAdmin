import {useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from 'react-player';
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/loader";
import { VideoCategorys } from "../types";
import uploadVideo from "../firebase_video/video";
const UpdateVideo = () => {
  const { id } = useParams();
  const [updatePost] = useUpdatePostMutation();
  const { data,isLoading } = useGetDataQuery({ url: `/video/get-video-byid/${id}` });
  const { data:cat } = useGetDataQuery({ url: "/video/get-category" });
  const [state, setState] = useState({
    title: "",
    slug: "",
    category: "",
    url: "",
    tags: "",
    description: "",
  });
  useEffect(()=>{
    setState({
      title: data?.title,
      slug: data?.slug,
      category: data?.category,
      url: data?.url,
      tags: data?.tags,
      description: data?.description,
    })
  },[data])
  console.log("Video Datas>>>",id,data);

  const navigate = useNavigate();
  const makeSlug = (value: string) => {
    return value.toLowerCase().replace(/\s+/g, "-");
  };
const [external,setExternal]=useState(false);
const HandleChange = (name: string, value: string) => {
  if (name === "title") {
    setState((prev) => ({ ...prev, [name]: value, slug: makeSlug(value) }));
  } else {
    setState((prev) => ({ ...prev, [name]: value }));
  }
};
const fileInputRef = useRef<HTMLInputElement>(null);
const [progressStatus, setProgressStatus] = useState<number | null>(null);
const handleFileUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target?.files?.[0];
  if (file) {
    try {
      const videourl = await uploadVideo(
        file.name,
        file,
        setProgressStatus
      );

      setState((prev) => ({ ...prev, url: videourl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading Video');
    }
}
};
const handleUpdate = async () => {
  try {
    const response = await updatePost({
      path: `/video/update/${id}`,
      data: state,
    });

    if (response?.data?.success) {
      toast.success(response.data.message, {
        autoClose: 3000,
      });
    } else {
      toast.error("Failed to update inner category");
    }
  } catch (error) {
    console.error("Update failed:", error);
  }
};
  return (
    <div className="p-5  w-full bg-[#e7e5e592]">
       {isLoading &&<Loader/>}
    <ToastContainer />
    <button
      onClick={() => navigate("/video")}
      className="bg-[#3d3d3d] text-[#f8f8f8] px-3 py-1 rounded-[7px] text-[14px] font-[600] mb-[10px] hover:bg-[#323131]"
    >
      {"< go back"}
    </button>
    <div className="flex flex-col gap-5 border border-[#8d8787f5] p-10 rounded-[7px]">
      <div className="flex gap-10">
        <div className="flex gap-5 w-full">
          <label> Title: </label>
          <input
            value={state?.title}
            onChange={(e) => HandleChange("title", e.target.value)}
            type="text"
            className="w-full p-1 rounded-[7px] outline-none border bg-[#e7e5e592] border-[#b9b4b4da]"
          />
        </div>
        <div className="flex gap-5 w-full">
          <label htmlFor="">category:</label>
          <select
            value={state?.category}
            onChange={(e) => HandleChange("category", e.target.value)}
            className="w-full p-1 rounded-[7px] outline-none border bg-[#e7e5e592] border-[#b9b4b4da]"
          >
            <option value={""}>Select</option>
            {cat?.map((item: VideoCategorys, index: number) => {
              return <option key={index} value={item?.category}>{item?.category}</option>;
            })}
          </select>
        </div>
      </div>
      <div className="flex gap-5 w-full">
        <label htmlFor="">External URL:</label>
        <input
          checked={external}
          onClick={() => setExternal(!external)}
          className="  rounded-[7px] outline-none border bg-[#e7e5e592] border-[#b9b4b4da]"
          type="checkbox"
        />
      </div>
      <div className=" w-full  flex justify-between">
          {external ? (
            <>
              <label htmlFor="">URL:</label>
              <input
                value={state?.url}
                onChange={(e) => HandleChange("url", e.target.value)}
                className="w-full h-[30px] p-1 rounded-[7px] outline-none border bg-[#e7e5e592] border-[#b9b4b4da]"
                type="text"
              />
            </>
          ) : (
            <div >
              <label>Upload Video:</label>
              <input
                ref={fileInputRef}
                accept="video/*"
                onChange={handleFileUpload}
                className="w-full h-[40px] p-1 rounded-[7px] outline-none border bg-[#e7e5e592] border-[#b9b4b4da]"
                type="file"
              />
                {progressStatus !== null && progressStatus !== 0 && (
                  <>
                    <div className="pt-2 inset-0 z-10 flex flex-row gap-2 items-end">
                      <p className='text-black text-[12px]'>uploading</p>
                      <div
                        className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"
                        style={{ width: `${progressStatus}%` }}
                     
                      ></div>
                    </div>
                  </>
                )}
            </div>
          )}
          <ReactPlayer url={state?.url} width="400px" height="200px" controls />
        </div>

      <div className="flex gap-5 w-full">
        <label>Description:</label>
        <ReactQuill
          theme="snow"
          value={state?.description}
          onChange={(content: string) => HandleChange("description", content)}
          className="h-60  rounded-[7px] w-full"
        />
      </div>
      <button
        disabled={!state?.title || !state?.category || !state?.url}
        onClick={handleUpdate}
        className={`${
          state?.title && state?.category && state?.url
            ? "bg-[#5a83bd]"
            : "bg-blue-300"
        } text-center  mt-8 p-1 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
      >
        save
      </button>
    </div>
  </div>
  );
};
export default UpdateVideo;
