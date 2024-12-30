import React, { useEffect, useRef, useState } from "react";

import { FaCaretDown } from "react-icons/fa";
import { TiArrowBackOutline } from "react-icons/ti";
import { useNavigate, useParams } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
// import uploadImage from "../firebase_image/image";
// import uploadVideo from "../firebase_video/video";
import ReactPlayer from "react-player";
import { MdOutlineOndemandVideo } from "react-icons/md";
import NewEditor from "../components/editorNew";
import { getMediaUrl } from "../utils/getMediaUrl";

interface CompaniesType {
  name: string;
  type: string;
  //   phone: string;
  discription: string | any;
  webLink: string;
  status: boolean | any;
  //   products: number;

  imageSrc: string;
  image: string;
  url: string;
}

const SponserCompaniesForm = () => {
  //   const companyUpdateData = useSelector((state) => state?.company?.companyData);
  const [updatePost] = useUpdatePostMutation();

  const { id } = useParams();


  const { data, isError } = useGetDataQuery({
    url: `/sponsor/company/${id}`,
  });

  // const [imagePreview, setImagePreview] = useState<any>()
  const [videoPreview, setVideoPreview] = useState<any>()
  const [companiesData, setCompaniesData] = useState<CompaniesType>({
    name: data?.name || "",
    type: data?.type || "",
    // phone: data?.phone || "",
    discription: data?.discription || "",
    webLink: data?.website || "",
    status: data?.status || false,
    // products: data?.productcount || 0,
    url: data?.video || "",
    imageSrc: data?.image,
    image: data?.image || "",
  });


  const isUpdate = Object.keys(data || [])?.length !== 0;

  const [isOpen, setOpen] = useState({
    type: false,
  });

  // const [progressStatus, setProgressStatus] = useState<number | null>(null);

  //   const [isError, setIsError] = useState(false);
  //   const pattern = new RegExp(/^\d{1,10}$/);

  const [external, setExternal] = useState<any>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  /* const [progressVideoStatus, setProgressVideoStatus] = useState<number | null>(
    null
  );
 */
  useEffect(() => {
    if (isUpdate && !isError) {
      setCompaniesData({
        name: data?.name,
        type: data?.type,
        // phone: data?.phone ,
        discription: data?.description,
        webLink: data?.link,
        status: data?.active,
        // products: data?.productcount || 0,
        url: data?.isYoutube && data?.video,

        imageSrc: getMediaUrl(data?.image, "sponsorImage"),
        image: getMediaUrl(data?.image, "sponsorImage"),
      });
      setExternal(data?.isYoutube)
      setVideoPreview(!data?.isYoutube && getMediaUrl(data?.video, "sponsorVideo"))
    }
  }, [isUpdate, isError, data]);

  // console.log(companiesData, isUpdate, isError, data);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setCompaniesData((prev: any) => ({ ...prev, url: file }));
      /* try {
        const videourl = await uploadVideo(file.name, file, setProgressVideoStatus);

        setCompaniesData((prev) => ({ ...prev, url: videourl }));
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading Video");
      } */
    }
  };

  //for text Data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setCompaniesData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditorOnChange = (e: any) => {
    setCompaniesData({ ...companiesData, discription: e })
  }

  const selectOption = (field: string, value: string) => {
    console.log(value);
    setCompaniesData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setOpen((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  //for Image Data

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      // setImagePreview(URL.createObjectURL(selectedFile))
      setCompaniesData((prev: any) => ({
        ...prev,
        image: selectedFile,
        imageSrc: selectedFile.name,
      }));
    }
  };

  const navigate = useNavigate();
  // const dispatch = useDispatch();


  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    /* const companySponserPostObject = {
      name: companiesData.name,
      type: companiesData.type,
      image: data?.image ? data?.image : companiesData.image,
      link: companiesData.webLink,
      video: companiesData.url,
      description: companiesData.discription,
      active: companiesData.status,
    }; */


    const formData = new FormData()
    formData.append("name", companiesData.name)
    formData.append("type", companiesData.type)
    formData.append("image", companiesData.image)
    formData.append("link", companiesData.webLink)
    formData.append("video", companiesData.url)
    formData.append("active", companiesData.status)
    formData.append("description", companiesData.discription)
    formData.append("isYoutube", external)
    toast.loading("Checking Details");
    try {
      // console.log("formData: ", formData);

      const response = await updatePost({
        data: formData,
        method: isUpdate && !isError ? "PUT" : "POST",
        path: isUpdate && !isError ? `/sponsor/company/${id}` : "/sponsor/company",
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
        toast.error(`Failed to ${isUpdate && !isError ? "Update Company" : "Add Company"}  for Sponsor`);
      }
    } catch (error) {
      toast.dismiss();
      /* console.error(
        `Error ${isUpdate && !isError ? "Update Company" : "Add Company"
        } for Sponsor:`,
        error
      ); */
      toast.error("An error occurred");
    }
  };

  const clearhandler = () => {
    setCompaniesData({
      name: "",
      type: "",
      discription: "",
      webLink: "",
      status: false,
      imageSrc: "",
      image: "",
      url: "",
    });

    navigate("/sponsor");
  };

  const sponserTypeData = ["main sponsor", "sub sponsor"];




  return (
    <div className="w-full md:px-4 md:ml-4 md:pl-0">
      <ToastContainer />
      <form className="w-full h-[calc(100vh-6rem)] overflow-hidden   rounded-md" onSubmit={submitHandler}>
        <div className="flex-1 h-full p-6 rounded font-montserrat">
          <div className="flex pb-2">
            <h2 className="md:text-4xl text-[28px] font-bold text-gray-500 font-mavenPro">Company Sponsor Form</h2>
            <div onClick={clearhandler}><TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" /></div>
          </div>

          <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
            <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
              <input value={companiesData.name} type="text" onChange={handleChange} name="name" className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 " placeholder="Company Name" required />

              <div className="relative w-full h-full">
                <input type="file" name="image" onChange={handleImageChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className={`px-4 py-2 pl-24 relative w-full text-base bg-green-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}>
                  {companiesData?.imageSrc || "Choose a file"}
                  <span className="text-gray-400 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-blue-100">Browse</span>
                </label>
                {/* {progressStatus !== null && progressStatus !== 0 && (
                  <>
                    <div className="absolute inset-0 z-10 flex items-end">
                      <div
                        className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"
                        style={{ width: `${progressStatus}%` }}
                      ></div>
                    </div>
                  </>
                )} */}
              </div>


              {/* Sponser Dropdown */}
              <div className="relative">
                <div className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-green-100 border-transparent rounded-md cursor-pointer focus:border-blue-200" onClick={() => setOpen({ ...isOpen, type: !isOpen.type })}>
                  {companiesData.type !== "" ? companiesData.type : "Select Status"}<FaCaretDown className="m-1" />
                </div>
                <ul className={`mt-2 p-2 rounded-md w-32 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${isOpen.type ? "max-h-60" : "hidden"} custom-scrollbar`}>
                  {sponserTypeData.map((type, i) => (
                    <li key={i} className={`p-2 mb-2 text-sm text-[#DEE1E2]  rounded-md cursor-pointer hover:bg-blue-200/60 ${companiesData.type === type ? "bg-rose-600" : ""}`} onClick={() => selectOption("type", type)}><span>{type}</span></li>
                  ))}
                </ul>
              </div>

              <input value={companiesData.webLink} type="url" onChange={handleChange} name="webLink" className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 " placeholder="Company Web Link" required />

              <div className="w-full outline-none md:col-span-2 ">
                <NewEditor value={companiesData?.discription} OnChangeEditor={handleEditorOnChange} />
              </div>

              <div className="w-full col-span-1 md:col-span-2">
                <div className="flex w-full gap-2 mb-2">
                  {/* Label for the External URL checkbox */}
                  <label htmlFor="" className="mb-1 font-medium text-gray-500">External URL</label>
                  {/* Checkbox to toggle between external URL and file upload */}
                  <input checked={external}
                    onClick={() => {
                      setExternal(!external); // Toggle the external state
                      setCompaniesData({ ...companiesData, url: '' }); // Reset the URL in companiesData
                      setVideoPreview(null); // Reset video preview
                    }}
                    className="rounded-[7px] outline-none border border-transparent bg-green-100 focus:border-blue-200"
                    type="checkbox"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Conditionally render based on the 'external' state */}
                  {external ? (
                    <>
                      {/* Input field for external video URL */}
                      <input value={external ? companiesData?.url : videoPreview} name="url" onChange={handleChange} className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200" type="url" placeholder="Video URL" />
                    </>
                  ) : (
                    <div>
                      {/* Label for video upload */}
                      <label className="ml-1 font-medium text-gray-500">Upload Video</label>
                      {/* File input for video upload */}
                      <input ref={fileInputRef} accept="video/*" onChange={handleFileUpload} className="w-full h-[40px] mt-2 p-1 rounded-[7px] outline-none border border-transparent bg-green-100 focus:border-blue-200" type="file" />
                      {/* Progress bar for video upload */}
                      {/* {progressVideoStatus !== null && progressVideoStatus !== 0 && (
                        <div className="inset-0 z-10 flex flex-row items-end gap-2 pt-2">
                          <p className="text-black text-[12px]">uploading</p>
                          <div
                            className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"
                            style={{ width: `${progressVideoStatus}%` }}
                          ></div>
                        </div>
                      )} */}
                    </div>
                  )}

                  {/* Video preview section */}
                  {videoPreview || companiesData?.url ? (
                    <ReactPlayer url={external ? companiesData?.url : videoPreview} width="400px" height="200px" controls />
                  ) : (
                    <div className="w-[400px] h-[200px] gap-4 bg-blue-50 flex justify-center items-center text-gray-400 font-semibold text-xl">
                      <MdOutlineOndemandVideo className="w-12 h-12" />
                      <span className="w-[180px]">Video will play here after upload</span>
                    </div>
                  )}
                </div>
              </div>


              <div className="flex items-center w-full gap-2">
                <label htmlFor="" className="mb-1 font-medium text-gray-500">Active Company</label>
                <input checked={companiesData.status} name="status" onChange={handleChange} className="  rounded-[7px] outline-none border border-transparent bg-green-100 focus:border-blue-200" type="checkbox" />
              </div>
            </div>

            <div className="flex">
              <button className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb] " type="submit">
                {Object.keys(data || {})?.length !== 0 ? "Update" : "Submit"}
              </button>
              <button className="px-4 py-2 ml-8 text-white rounded-md bg-rose-600 hover:bg-rose-700" type="button" onClick={clearhandler}>Cancel</button>
            </div>
          </div >
        </div >
      </form >
    </div >
  );
};

export default SponserCompaniesForm;
