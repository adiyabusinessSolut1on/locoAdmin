import React, { useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import {  useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {  useUpdatePostMutation } from "../api";
import uploadImage from "../firebase_image/image";
import { sponsorProductsType } from "../types";

interface CompaniesType {
  name: string;
  discription: string;
  webLink: string;
  status: boolean;
  imageSrc: string;
  image: string;
 
}

interface Props{
  close:()=>void,
  updateData:sponsorProductsType,
  sponsorname:string
  isCreate:boolean
}

const ProductForm = ({ close, updateData , sponsorname,isCreate }:Props) => {

  const [updatePost] = useUpdatePostMutation();
console.log("isCreate>>>>",isCreate)
  const { id } = useParams();

  const [ProductData, setProductData] = useState<CompaniesType>({
    name: updateData?.name || "",

    // phone: updateData?.phone || "",
    discription: updateData?.description || "",
    webLink: updateData?.link ? updateData?.link : "",
    status: updateData?.active || false,
    // products: updateData?.productcount || 0,

    imageSrc:
      updateData?.image?.slice(67, updateData?.image?.indexOf("%")) || "",
    image: updateData?.image || "",
  });

  const [progressStatus, setProgressStatus] = useState<number | null>(null);

  //for text Data
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
   
  };
  
  //for Image Data
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
  
      const imageUrl = await uploadImage(
        selectedFile.name,
        selectedFile,
        setProgressStatus
      );
  
      setProductData((prev) => ({
        ...prev,
        image: imageUrl,
        imageSrc: selectedFile.name,
      }));
    }
  };

  //   console.log(updateData ? "PUT Operation" : "POST Operation");
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const companySponserProductPostObject = {
      name: ProductData.name,
      image:  ProductData.image,
      link: ProductData.webLink,
      description: ProductData.discription,
      active: ProductData.status,
      sponsorname: sponsorname ? sponsorname : updateData?.sponsorname,
      companyId: id,
    };

    toast.loading("Checking Details");
    try {
      console.log(companySponserProductPostObject, "submit");
      const response = await updatePost({
        data: companySponserProductPostObject,
        method: isCreate ? "POST" : "PUT",
        path: isCreate
          ? "/sponsor/product"
          : `/sponsor/product/${updateData?._id}`,
      });
      if (response?.data?.success) {
        toast.dismiss();
        toast.success(response?.data?.message);
        clearhandler();
      } else {
        toast.dismiss();
        toast.error("Failed to Add Producct for Sponsor Companey");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error Add Producct for Sponsor Companey:", error);
      toast.error("An error occurred");
    }
  };

  const clearhandler = () => {
    setProductData({
      name: "",

      discription: "",
      webLink: "",
      status: false,

      imageSrc: "",
      image: "",
    });
    close();
  };

  const refusetoClosehandler = (e:React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 "
      onClick={close}
    >
      <ToastContainer/>
      <div
        className="flex items-center w-[360px] px-4 md:px-0 md:w-[600px] justify-center bg-white rounded-md"
        onClick={refusetoClosehandler}
      >
        <form className="w-full" onSubmit={submitHandler}>
          <div className="p-6 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className="md:text-4xl text-[28px] font-bold text-gray-600">
                Product Form
              </h2>
              <div onClick={clearhandler}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" />
              </div>
            </div>
            <div className=" w-full overflow-y-auto pr-4 md:pr-0 [&::-webkit-scrollbar]:hidden">
              <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
                <input
                  value={ProductData.name}
                  type="text"
                  onChange={handleChange}
                  name="name"
                  className="w-full h-10 pl-4 font-medium border border-transparent rounded-md outline-none bg-green-50 focus:border-blue-200 "
                  placeholder="Product Name"
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
                    className={`px-4 py-2 pl-20 relative ${
                      progressStatus ? "pb-2" : ""
                    } w-full text-base bg-green-50 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}
                  >
                    {ProductData?.imageSrc
                      ? ProductData?.imageSrc?.slice(0, 20) + "..."
                      : "Choose a file"}
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

                <input
                  value={ProductData.webLink}
                  type="url"
                  onChange={handleChange}
                  name="webLink"
                  className="w-full h-10 pl-4 font-medium border border-transparent rounded-md outline-none bg-green-50 focus:border-blue-200 "
                  placeholder="Product Web Link"
                  required
                />

                <textarea
                  value={ProductData.discription}
                  onChange={handleChange}
                  name="discription"
                  className="w-full h-24 py-4 pl-4 font-medium border border-transparent border-gray-400 rounded-md outline-none md:col-span-2 bg-green-50 focus:border-blue-200 "
                  placeholder="Write Details"
                  required
                />

                <div className="flex items-center w-full gap-2">
                  <label htmlFor="" className="mb-1 font-medium text-gray-500">
                    Active Product
                  </label>
                  <input
                    checked={ProductData.status}
                    name="status"
                    onChange={handleChange}
                    className="  rounded-[7px] outline-none border border-transparent bg-green-50 focus:border-blue-200"
                    type="checkbox"
                  />
                </div>
              </div>

              <div className="flex">
                <button
                  className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb] "
                  type="submit"
                  // disabled={isError}
                >
                  {Object.keys(updateData || {})?.length !== 0
                    ? "Update"
                    : "Submit"}
                </button>
                <button
                  className="px-4 py-2 ml-8 text-white rounded-md bg-rose-600 hover:bg-rose-700"
                  type="button"
                  onClick={close}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
