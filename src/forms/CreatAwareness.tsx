import { useEffect, useState } from "react";
import {
  useGetDataQuery,
  useUpdatePostMutation,
} from "../api";
import uploadImage from "../firebase_image/image";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaCaretDown } from "react-icons/fa";
import { awarenessCategoryType } from "../types";
import TextEditor from "../components/textEditor";


interface StateProps {
  category: CategoryType;
  title: string;

  thumnail: string;
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
  const {
    data: updateAwar,
    isError: isErrorAwar,
  } = useGetDataQuery({ url: `/awareness/${id}` });

  const isUpdate = Object.keys(updateAwar || [])?.length !== 0;
  

  const { data } = useGetDataQuery({
    url: "/awareness/category",
  });
console.log("Awareness Category>>>>",data)

  const [state, setState] = useState<StateProps>({
    category: {
      name: updateAwar?.category || "",
      id: "",
    },
    title: updateAwar?.title || "",

    thumnail: updateAwar?.image || "",
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

        thumnail: updateAwar?.image,
        content: updateAwar?.description,
      });
    }
  }, [isUpdate, isErrorAwar, updateAwar]);
 
  const HandleChange = (name: string, value: string | CategoryType) => {
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
        setState({ ...state, thumnail: imageUrl });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };
  const navigate = useNavigate();
  const handleSubmit = async (e:React.FormEvent) => {
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

  return (
    <div className="w-full p-5 bg-blue-100">
      <ToastContainer/>
      <button
        onClick={() => navigate("/awareness")}
        className="bg-[#3d3d3d] text-[#f8f8f8] px-3 py-1 rounded-[7px] text-[14px] font-[600] mb-[10px] hover:bg-[#323131]"
      >
        View Awareness List
      </button>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 border bg-white border-[#8d8787f5] p-10 rounded-[7px]"
      >
        <div className="flex flex-col w-full gap-1">
          {/* <label>Title</label> */}
          <input
            value={state?.title}
            onChange={(e) => HandleChange("title", e.target.value)}
            type="text"
            placeholder="Title"
            className="border pl-4 border-[#b9b4b4da] bg-[#e7e5e592] outline-none p-1 rounded-[7px]"
          />
        </div>
        <div className="relative  w-full md:w-[43%]">
          <div
            className="flex realtive justify-between p-2  pl-4  border rounded-md cursor-pointer   focus:border-[#DEE1E2]  border-[#b9b4b4da] bg-[#e7e5e592] "
            onClick={() => setOpen((prev) => !prev)}
          >
            {state?.category?.name !== "" ? (
              state?.category?.name
            ) : (
              <span className="text-sm font-normal text-gray-400">
                Select Category
              </span>
            )}
            <FaCaretDown className="m-1" />
          </div>
          <ul
            className={`mt-2 p-2 rounded-md w-40 [&::-webkit-scrollbar]:hidden overflow-y-scroll  bg-gray-100 shadow-lg absolute z-10 ${
              isOpen ? "max-h-40" : "hidden"
            } custom-scrollbar`}
          >
            {data?.map((category:awarenessCategoryType, i:number) => (
              <li
                key={i}
                className={`p-2 ${
                  data.length > 1 ? "mb-2" : ""
                } text-sm font-medium rounded-md cursor-pointer flex items-center gap-2 hover:bg-blue-200/60 ${
                  state?.category?.name === category?.name ? "bg-rose-600" : ""
                }`}
                onClick={() =>
                  HandleChange("category", {
                    name: category?.name,
                    id: category?._id,
                  })
                }
              >
                {category?.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex flex-row gap-5 mb-6 outline-none ">
          <div className="w-full ">
            {/* <label className="block mb-2 font-semibold text-gray-700">
              Awareness Image
            </label> */}
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
        <div>
        <TextEditor
               value={state?.content}
                OnChangeEditor={(e:string) => HandleChange("content", e)}
                />
      
        </div>
        <button
          //   onClick={HandleCreate}
          type="submit"
          disabled={
            !state?.thumnail ||
            !state?.category.name ||
            !state?.title ||
            !state?.content
          }
          className={`${
            state?.thumnail &&
            state?.category.name &&
            state?.title &&
            state?.content
              ? "bg-[#5a83bd]"
              : "bg-gray-500"
          } text-center  mt-8 p-1 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
        >
          save
        </button>
      </form>
    </div>
  );
};

export default CreatAwareness;
