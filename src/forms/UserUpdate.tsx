import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/loader";
import uploadImage from "../firebase_image/image";
import { TiArrowBackOutline } from "react-icons/ti";

const UserUpdate = () => {
  const { id } = useParams();
  const [updatePost] = useUpdatePostMutation();
  const { data, isLoading } = useGetDataQuery({ url: `/getuser/${id}` });
  const [user, setCurrentUser] = useState({
    image: "",
    name: "",
    email: "",
    mobile: "",
    imageTitle: "",
  });
  useEffect(() => {
    setCurrentUser({
      image: data?.image,
      name: data?.name,
      email: data?.email,
      mobile: data?.mobile,
      imageTitle: data?.image?.slice(72, data?.image?.indexOf("%2F")),
    });
  }, [data]);

  const navigate = useNavigate();

  console.log("user Data in this >>", data);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser({ ...user, [name]: value });
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
        console.log(imageUrl, selectedFile, "<<frommodal>>");
        setCurrentUser({
          ...user,
          image: imageUrl,
          imageTitle: selectedFile.name,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("hello");
    toast.loading("checking Info");
    try {
      const response = await updatePost({
        path: `/update-user/${id}`,
        data: user,
      });

      if (response?.data?.success) {
        toast.dismiss();
        toast.success(response.data.message, {
          autoClose: 5000,
        });
        navigate("/users");
      } else {
        toast.dismiss();
        toast.error("Failed to Update User");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.dismiss();
      toast.error("Failed to Update User");
    }
  };
  return (
    <div className="flex items-center justify-center w-full h-full p-6 bg-gradient-to-r from-blue-100 to-purple-200">
      {isLoading && <Loader />}
      <ToastContainer />
      <div className="w-full max-w-xl p-8 transition duration-500 transform bg-white rounded-lg shadow-2xl hover:scale-105">
        <div className="flex justify-center pb-2">
          <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
            Edit User
          </h2>
          <div>
            <Link to={"/users"}>
              <TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" />
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-2">
            {user?.image && (
              <div className="relative flex justify-center col-span-1 mb-6 md:col-span-2 ">
                <img
                  src={user.image}
                  alt="Profile"
                  className="object-cover w-20 h-20 transition duration-500 transform rounded-full shadow-lg hover:scale-110"
                />
              </div>
            )}

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
                className={`px-4 py-2 pl-24 relative ${
                  progressStatus ? "pb-2" : ""
                } w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}
              >
                {user.imageTitle || "Choose a file"}
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

            <input
              value={user?.name}
              type="text"
              onChange={handleInputChange}
              name="name"
              className="w-full h-10 pl-4 font-medium bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
              placeholder="Enter Name"
              required
            />

            <input
              value={user?.email}
              type="text"
              onChange={handleInputChange}
              name="email"
              className="w-full h-10 pl-4 font-medium bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
              placeholder="Enter Email"
              required
            />

            <input
              value={user?.mobile}
              type="text"
              onChange={handleInputChange}
              name="mobile"
              className="w-full h-10 pl-4 font-medium bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
              placeholder="Enter Mobile Number"
              required
            />
            <div className="flex justify-end w-full col-span-1 md:col-span-2">
              <button
                type="submit"
                className="px-6 py-3 text-white transition duration-500 transform rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl "
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserUpdate;
