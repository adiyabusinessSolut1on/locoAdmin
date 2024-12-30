import React, { useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
// import uploadImage from "../firebase_image/image";
import { toast } from "react-toastify";
import { FaRegImage } from "react-icons/fa";
import { MdOutlineGeneratingTokens } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useUpdatePostMutation } from "../api";

interface userForm {
  isCreat: boolean;
}
interface Props {
  //   isQuizForm: {
  //     creat: boolean;
  //     updateId: string;
  //   };
  setUserForm: React.Dispatch<React.SetStateAction<userForm>>;
}

const CreatUser = ({ setUserForm }: Props) => {

  const [imagePreview, setImagePreview] = useState<any>()
  const [userDataForm, setUserDataForm] = useState<any>({
    name: "",
    email: "",
    number: 0,
    thumnail: "",
    imageTitle: "",
    password: "",
    designation: "",
    division: "",
  });

  const [updatePost] = useUpdatePostMutation();

  // const [progressStatus, setProgressStatus] = useState<number | null>(null);
  const [isVisible, setVisible] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDataForm((prev: any) => ({
      ...prev,
      [e?.target?.name]:
        e?.target?.type === "checkbox" ? e?.target?.checked : e?.target?.value,
    }));
  };

  const generatePassword = () => {
    const length = 12;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    const generatedPassword = Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
    setUserDataForm((prev: any) => ({
      ...prev,
      password: generatedPassword,
    }));
  };

  const submiteHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.loading("Checking Details");
    try {
      const formData = new FormData()
      formData.append("name", userDataForm.name)
      formData.append("email", userDataForm.email)
      formData.append("mobile", userDataForm.number)
      formData.append("image", userDataForm.thumnail)
      formData.append("password", userDataForm.password)
      formData.append("designation", userDataForm.designation)
      formData.append("division", userDataForm.division)
      const response = await updatePost({ data: formData, method: "POST", path: "/create-user", }).unwrap()
      if (response?.success) {
        toast.dismiss();
        toast.success(response?.message, { autoClose: 5000, });
        closeHandler();
      } else {
        toast.dismiss();

        toast.error(`Failed to  Create User`);
      }
    } catch (error: any) {
      toast.dismiss();
      console.error(`Error Creating User:${error}`);
      toast.error(`Error Creating User: ${error?.data?.message}`);
    }
  };

  const closeHandler = () => {
    // if (isQuizForm.creat) {
    setUserForm((prev) => ({
      ...prev,
      isCreat: !prev.isCreat,
    }));

    setUserDataForm({
      name: "",
      email: "",
      thumnail: "",
      imageTitle: "",
      number: 0,
      password: "",
      designation: "",
      division: "",
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      try {
        setImagePreview(URL.createObjectURL(selectedFile));
        setUserDataForm((prev: any) => ({
          ...prev,
          thumnail: selectedFile,
          imageTitle: selectedFile.name,
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center px-4 sm:px-0 bg-black/40" onClick={closeHandler}>
      <div className="bg-white rounded-md w-[600px]" onClick={(e) => e.stopPropagation()}>
        <form className="" onSubmit={submiteHandler}>
          {/* left section */}
          <div className="p-6 px-8 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className=" md:text-4xl text-[28px] font-bold text-gray-700 font-mavenPro">User Form</h2>
              <button onClick={closeHandler}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 hover:text-orange-600 text-sky-600" />
              </button>
            </div>

            <div className="h-[calc(100vh-15rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
              <div className="text-white h-[140px] md:h-[180px] bg-blue-50 rounded-md ">
                {imagePreview ? (
                  <img src={imagePreview} alt={userDataForm?.imageTitle} className="rounded-[5px] object-contain w-full h-full" />
                ) : (
                  <p className="flex items-center justify-center w-full h-full gap-4 p-4 text-sm">
                    <FaRegImage className="w-16 h-12 text-gray-500" />
                    <span className="text-xl font-medium text-gray-500 w-[180px]">Here Uploade Image will be shown</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 py-4 md:grid-cols-2 md:gap-4 ">
                {/* <div className="w-full font-mavenPro"> */}
                <input value={userDataForm?.name} type="text" onChange={handleChange} name="name" className="w-full h-10 pl-4 font-medium bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 " placeholder={"Enter Name"} required />
                {/* <div className="grid grid-cols-1 col-span-1 gap-4 md:grid-cols-2 md:col-span-2"> */}
                <div className="relative w-full ">
                  <input type="file" name="image" onChange={handleImageChange} className="hidden" id="file-upload" />
                  {/* <label htmlFor="file-upload" className={`px-4 py-2 pl-24 relative ${progressStatus ? "pb-2" : ""} w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}> */}
                  <label htmlFor="file-upload" className={`px-4 py-2 pl-24 relative w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}>
                    {userDataForm.imageTitle || "Choose a file"}
                    <span className="text-gray-500 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-blue-200"> Browse</span>
                  </label>

                  {/* {progressStatus !== null && progressStatus !== 0 && (
                    <>
                      <div className="absolute left-0 right-0 top-20%  z-10 flex items-end">
                        <div className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"style={{ width: `${progressStatus}%` }}
                        ></div>
                      </div>
                    </>
                  )} */}
                </div>
                {/* </div> */}
                <input value={userDataForm?.email} type="email" onChange={handleChange} name="email" className="w-full h-10 pl-4 font-medium bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 " placeholder={"Enter Email"} required />
                <input value={userDataForm?.number || ""} type="number" onChange={handleChange} name="number" className="w-full h-10 pl-4 font-medium bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 " placeholder={"Enter Phone number"} required />
                <input value={userDataForm?.designation || ""} type="text" onChange={handleChange} name="designation" className="w-full h-10 pl-4 font-medium bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 " placeholder={"Enter Designation"} required />
                <input value={userDataForm?.division || ""} type="text" onChange={handleChange} name="division" className="w-full h-10 pl-4 font-medium bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 " placeholder={"Enter Division"} required />

                <div className="w-full md:col-span-2">
                  <div className="flex">
                    <div className="relative w-full">
                      <input value={userDataForm?.password || ""} type={`${isVisible ? "text" : "password"}`} onChange={handleChange} name="password" className="w-full h-10 pl-4 font-medium bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 " placeholder={"Enter Password"} required />
                      <button className="absolute text-gray-400 right-4 top-[10px]" role="button" onClick={(e) => { e.preventDefault(); setVisible((prev) => !prev); }}>
                        {isVisible ? (
                          <FiEye className="w-5 h-5 text-blue-400" />
                        ) : (
                          <FiEyeOff className="w-5 h-5 " />
                        )}
                      </button>
                    </div>

                    <button type="button" className="px-2 py-2 ml-2 text-white bg-blue-600 rounded-md hover:bg-blue-500" onClick={generatePassword}><MdOutlineGeneratingTokens className="w-6 h-6" /></button>
                  </div>
                  <p className="mt-1 text-xs font-bold text-gray-600">Enter Password or Click on button to generate Password</p>
                </div>
              </div>

              <div className="flex ">
                <button className="px-4 py-2 text-white bg-[#1f3c88] rounded hover:bg-[#2950b1]" type="submit">Submit</button>
                <button className="px-4 py-2 ml-8 text-white bg-red-500 rounded hover:bg-red-400" onClick={closeHandler}>Cancel</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatUser;
