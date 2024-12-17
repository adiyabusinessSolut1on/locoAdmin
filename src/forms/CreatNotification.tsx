import { useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { toast } from "react-toastify";
import { AwarenessType, BlogSTyepes } from "../types";
import { FaCaretDown } from "react-icons/fa";
import uploadImage from "../firebase_image/image";

interface Props {
  setCategoryForm: React.Dispatch<React.SetStateAction<boolean>>;
}

interface BlogDetails {
  name?: string;
  _id?: string;
}

interface BlogStateType {
  blogId: BlogDetails | null;
  message: string;
  title: string;
  awarenessId: string | any;
}

const CreatNotification = ({ setCategoryForm }: Props) => {
  const [notificationDataForm, setNotificationDataForm] = useState<BlogStateType>({
    blogId: null,
    title: "",
    message: "",
    awarenessId: ""
  });
  const [updatePost] = useUpdatePostMutation();

  const [uploadPhoto, setUploadPhoto] = useState<any>()
  const [progressStatus, setProgressStatus] = useState<boolean | any>(false)

  const { data } = useGetDataQuery({
    url: "/blog/getallblogs",
  });
  const { data: awareness } = useGetDataQuery({
    url: "/awareness",
  });

  // console.log("awareness: ", awareness?.data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationDataForm((prev) => ({
      ...prev,
      [e?.target?.name]:
        e?.target?.type === "checkbox" ? e?.target?.checked : e?.target?.value,
    }));
  };

  const [isOpen, setOpen] = useState(false);
  const [isOpenAwareness, setOpenAwareness] = useState(false);

  const selectOption = (field: string, value: BlogDetails) => {
    // console.log("field: ", field);

    // console.log("value: ", value);
    setNotificationDataForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field == 'blogId') {
      setOpen((prev) => !prev);
    }
    if (field == 'awarenessId') {
      setOpenAwareness((prev) => !prev);
    }
  };

  const submiteHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // console.log(notificationDataForm);
    try {
      const payload = {
        blogId: notificationDataForm?.blogId?._id,
        title: notificationDataForm?.title,
        message: notificationDataForm?.message,
        awarenessId: notificationDataForm?.awarenessId,
        image: uploadPhoto
      };

      // console.log(payload);
      toast.loading("Checking Details");
      const response = await updatePost({ data: payload, method: "POST", path: "/notify", });
      console.log(response);
      if (response?.data?.success) {
        toast.dismiss();
        toast.success(response?.data?.message, { autoClose: 5000, });
        closeHandler();
      } else {
        toast.dismiss();
        toast.error("Failed to create Notification");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error creating Notification:", error);
      toast.error("An error occurred");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      try {
        const imageUrl = await uploadImage(selectedFile.name, selectedFile, setProgressStatus)
        console.log("imageUrl: ", imageUrl);
        setUploadPhoto(imageUrl)
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };

  const closeHandler = () => {
    // if (isCategoryForm) {
    setCategoryForm((prev) => !prev);
    // }

    setNotificationDataForm({
      blogId: null,
      title: "",
      message: "",
      awarenessId: null,
    });
    console.log("notificationDataForm: ", notificationDataForm);
  };


  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center px-4 sm:px-0 bg-black/40" onClick={closeHandler}>
      <div className="bg-white rounded-md w-[600px]" onClick={(e) => e.stopPropagation()}>
        <form className="" onSubmit={submiteHandler}>
          {/* left section */}
          <div className="p-6 px-8 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className=" md:text-4xl text-[28px] font-bold text-gray-700 font-mavenPro">Notification Form</h2>
              <button onClick={closeHandler}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 hover:text-orange-600 text-sky-600" />
              </button>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 py-4 md:grid-cols-2 font-mavenPro">
              <input value={notificationDataForm?.title} type="text" onChange={handleChange} name="title" className={" font-medium outline-none w-full  border h-10 border-transparent bg-blue-100 rounded-md pl-4 focus-within:border-blue-400  "} placeholder={"Enter Title"} required />
              <input value={notificationDataForm?.message} type="text" onChange={handleChange} name="message" className={" font-medium outline-none w-full  border h-10 border-transparent bg-blue-100 rounded-md pl-4 focus-within:border-blue-400  "} placeholder={"Enter Message"} required />

              {/* handle image */}
              {/* <div className="relative w-full h-full">
                <input type="file" name="image" onChange={handleImageChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className={`px-4 py-2 pl-24 relative ${progressStatus ? "pb-2" : ""} w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}>
                  {uploadImage || "Choose a file"}
                  <span className="text-gray-400 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-blue-200">Browse</span>
                </label>

                {progressStatus !== null && progressStatus !== 0 && (
                  <>
                    <div className="absolute inset-0 z-10 flex items-end">
                      <div className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]" style={{ width: `${progressStatus}%` }}></div>
                    </div>
                  </>
                )}
              </div> */}

              {/* handle image */}
              <div className="relative md:col-span-2">
                <input type="file" name="image" onChange={handleImageChange} className="hidden" id="file-upload" accept="image/*" />
                <label htmlFor="file-upload" className={`px-4 py-2 pl-24 relative ${progressStatus ? "pb-2" : ""} w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between z-20`}>
                  {uploadPhoto || "Choose a file"}
                  <span className="text-gray-400 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-blue-200">Browse</span>
                </label>

                {progressStatus !== null && progressStatus !== 0 && (
                  <div className="absolute inset-0 z-10 flex items-end">
                    <div className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]" style={{ width: `${progressStatus}%` }}></div>
                  </div>
                )}
                <div className="absolute inset-0 z-10 flex items-end">
                  <div className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]" style={{ width: `${progressStatus}%` }}></div>
                </div>
              </div>




              <div className="relative md:col-span-2">
                <div className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-blue-100 border-transparent rounded-md cursor-pointer focus:border-blue-200" onClick={() => setOpen((prev) => !prev)}>
                  <p className={`${notificationDataForm.blogId !== null ? "text-gray-700" : ""}`}>
                    {notificationDataForm.blogId !== null ? notificationDataForm.blogId?.name : "Select Blog"}
                  </p>
                  <FaCaretDown className="m-1" />
                </div>

                <ul className={`mt-2 p-2 rounded-md w-64 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${isOpen ? "max-h-60 overflow-y-auto" : "hidden"} custom-scrollbar`}>
                  {data?.data?.length > 0 ? (
                    data?.data?.map((blog: BlogSTyepes, i: number) => (
                      <li key={i} className={`p-2 mb-2 text-sm text-[#DEE1E2] rounded-md cursor-pointer hover:bg-blue-200/60 ${notificationDataForm.blogId?.name === blog?.title ? "bg-rose-600" : ""}`} onClick={() => selectOption("blogId", { name: blog?.title, _id: blog?._id })}>
                        <span>{blog.title}</span>
                      </li>
                    ))
                  ) : (
                    <div>Data Not Found</div>
                  )}
                </ul>
              </div>

              {/* awarence */}
              <div className="relative md:col-span-2">
                <div className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-blue-100 border-transparent rounded-md cursor-pointer focus:border-blue-200" onClick={() => setOpenAwareness((prev) => !prev)}>
                  <p className={`${notificationDataForm.awarenessId !== null ? "text-gray-700" : ""}`}>{notificationDataForm.awarenessId !== null ? notificationDataForm.awarenessId?.name : "Select Awareness"}</p>
                  <FaCaretDown className="m-1" />
                </div>

                <ul className={`mt-2 p-2 rounded-md w-64 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${isOpenAwareness ? "max-h-60 overflow-y-auto" : "hidden"} custom-scrollbar`}>
                  {awareness?.length > 0 ? (
                    awareness?.map((blog: AwarenessType, i: number) => (
                      <li key={i} className={`p-2 mb-2 text-sm text-[#DEE1E2] rounded-md cursor-pointer hover:bg-blue-200/60 ${notificationDataForm.awarenessId?.name === blog?.title ? "bg-rose-600" : ""}`} onClick={() => selectOption("awarenessId", { name: blog?.title, _id: blog?._id })}>
                        <span>{blog.title}</span>
                      </li>
                    ))
                  ) : (
                    <div>Data Not Found</div>
                  )}
                </ul>
              </div>

            </div>

            <div className="flex mt-3">
              <button className="px-4 py-2 text-white bg-[#1f3c88] rounded hover:bg-[#2950b1]" type="submit">Submit</button>
              <button className="px-4 py-2 ml-8 text-white bg-red-500 rounded hover:bg-red-400" onClick={closeHandler}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatNotification;
