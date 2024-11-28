import { useEffect, useState } from "react";
import { useGetDataQuery, useUpdatePostMutation } from "../api";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uploadFile from "../firebase_file/file";
import { TiArrowBackOutline } from "react-icons/ti";
import Loader from "../components/loader";

interface Props {
  title: string;
  donwloadable: boolean;
  link: string;
  imageSrc: string;
}

const CreatDocuments = () => {
  const { id } = useParams();
  // const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const { data, isLoading, isError } = useGetDataQuery({
    url: `/important_link/${id}`,
  });

  const [value, setValue] = useState<Props>({
    title: data?.title || "",
    link: data?.link || "",
    donwloadable: false,
    imageSrc:
      data?.image?.substring(
        data?.image?.lastIndexOf("%"),
        data?.image?.lastIndexOf("/") + 1
      ) || "",
  });

  const isUpdate = Object.keys(data || [])?.length !== 0;

  const OnchangeValue = (name: string, val: React.ReactNode) => {
    setValue((prev) => ({ ...prev, [name]: val }));
  };
  const [isExternal, setIsExternal] = useState(false);

  const [progressStatus, setProgressStatus] = useState<number | null>(null);

  useEffect(() => {
    console.log("running");
    if (isUpdate && !isError) {
      console.log("updatd");
      setValue({
        link: data?.link || "",
        donwloadable: data?.donwloadable || "",
        title: data?.title || "",
        imageSrc:
          data?.link?.substring(
            data?.link?.lastIndexOf("%2F"),
            data?.link?.lastIndexOf("/") + 1
          ) || "",
      });
    }
  }, [isUpdate, isError, data]);

  const hanhleFilecUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      try {
        const imageUrl = await uploadFile(
          selectedFile.name,
          selectedFile,
          setProgressStatus
        );
        setValue({ ...value, link: imageUrl, imageSrc: selectedFile.name });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Checking Details");
    try {
      const response = await updatePost({
        data: { ...value },
        method: isUpdate && !isError ? "PUT" : "POST",
        path:
          isUpdate && !isError
            ? `/important_link/${id}`
            : `/important_link/create`,
      });

      if (response?.data?.success) {
        toast.dismiss();
        toast.success(response.data.message);

        clearhandler();
      } else {
        toast.dismiss();
        toast.error("Failed to create Sub sub-category");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred");
    }
  };

  const clearhandler = () => {
    setValue({
      title: "",
      link: "",
      donwloadable: false,
      imageSrc: "",
    });

    navigate("/important-document");
  };

  console.log(value, id, data, isUpdate ? "Put" : "Post");

  return (
    <div className="w-full md:px-4 md:ml-4 md:pl-0">
      {/* <ToastContainer /> */}
      {isLoading && <Loader />}
      <form
        className="w-full h-[calc(100vh-6rem)] overflow-hidden   rounded-md"
        onSubmit={handleCreate}
      >
        <div className="flex-1 h-full p-6 rounded font-montserrat">
          <div className="flex pb-2">
            <h2 className="md:text-4xl text-[28px] font-bold text-gray-500 font-mavenPro">
              Creat Document Form
            </h2>
            <div onClick={clearhandler}>
              <TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" />
            </div>
          </div>
          <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
            <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
              <input
                value={value?.title}
                onChange={(e) => OnchangeValue("title", e.target.value)}
                type="text"
                placeholder="Enter Title"
                className="w-full h-10 pl-4 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                required
              />
              {isExternal ? (
                <div className="flex flex-col w-full gap-1">
                  <input
                    value={value?.link && value?.link}
                    onChange={(e) => OnchangeValue("link", e.target.value)}
                    type="text"
                    placeholder="Enter Url"
                    className="w-full h-10 pl-4 font-medium bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                  />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <input
                    type="file"
                    name="image"
                    onChange={hanhleFilecUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`px-4 py-2 pl-24 relative ${
                      progressStatus ? "pb-2" : ""
                    } w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}
                  >
                    <p
                      className={`font-medium ${
                        value?.imageSrc && "text-gray-700"
                      }`}
                    >
                      {value?.imageSrc || "Choose a file"}
                    </p>
                    <span className="text-gray-400 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-blue-200">
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
              )}

              {/* file input to text input */}

              {/* download able  */}
              <div className="flex items-center order-2 w-full gap-2 md:order-1 ">
                <label htmlFor="" className="mb-1 font-medium text-gray-500">
                  Download Able
                </label>
                <input
                  checked={value?.donwloadable}
                  onChange={() =>
                    OnchangeValue("donwloadable", !value?.donwloadable)
                  }
                  className="  rounded-[7px] outline-none border border-transparent bg-blue-100 focus:border-blue-200"
                  type="checkbox"
                />
              </div>
              <div className="flex order-1 w-full gap-2 md:order-2">
                <label htmlFor="" className="mb-1 font-medium text-gray-500">
                  External URL
                </label>
                <input
                  checked={isExternal}
                  onChange={() => setIsExternal(!isExternal)}
                  className="  rounded-[7px] outline-none border border-transparent bg-blue-100 focus:border-blue-200"
                  type="checkbox"
                />
              </div>
            </div>

            <div className="flex">
              <button
                className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb] disabled:bg-gray-700 "
                type="submit"
                disabled={!value?.link || !value?.title}
              >
                {isUpdate ? "Update" : "Submit"}
                {/* Save */}
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

export default CreatDocuments;
