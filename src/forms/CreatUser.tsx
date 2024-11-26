import React, { useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import uploadImage from "../firebase_image/image";
import { toast } from "react-toastify";
import { FaRegImage } from "react-icons/fa";

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
  const [userDataForm, setUserDataForm] = useState({
    name: "",
    email: "",
    number: 0,
    thumnail: "",
    imageTitle: "",
  });

  const [progressStatus, setProgressStatus] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDataForm((prev) => ({
      ...prev,
      [e?.target?.name]:
        e?.target?.type === "checkbox" ? e?.target?.checked : e?.target?.value,
    }));
  };

  const submiteHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(userDataForm);
    // toast.loading("Checking Details");
    // try {
    //   const payload = {
    //     title: quizDataForm?.title,
    //     instructions: quizDataForm?.instructions,
    //     isComplete: quizDataForm?.completed,
    //   };

    //   const response = await updatePost({
    //     data: payload,
    //     method: isQuizForm.creat ? "POST" : "PUT",
    //     path: isQuizForm.creat ? "/quiz" : `/quiz/${isQuizForm.updateId}`,
    //   });
    //   console.log(response);
    //   if (response?.data?.success) {
    //     toast.dismiss();
    //     toast.success(response?.data?.message, {
    //       autoClose: 5000,
    //     });
    //     closeHandler();
    //   } else {
    //     toast.dismiss();
    //     toast.error(
    //       `Failed to  ${isQuizForm.creat ? "Create Quiz" : "Update Quiz"}`
    //     );
    //   }
    // } catch (error) {
    //   toast.dismiss();
    //   console.error(
    //     `Error ${isQuizForm.creat ? "Creating Quiz" : "Updating Quiz"} :`,
    //     error
    //   );
    //   toast.error(
    //     `Error ${
    //       isQuizForm.creat ? "Creating Quiz" : "Updating Quiz"
    //     } : ${error}`
    //   );
    // }
  };

  const closeHandler = () => {
    // if (isQuizForm.creat) {
    setUserForm((prev) => ({
      ...prev,
      isCreat: !prev.isCreat,
    }));
    // }
    // else {
    //   setQuizForm((prev) => ({
    //     ...prev,
    //     updateId: "",
    //   }));
    // }

    setUserDataForm({
      name: "",
      email: "",
      thumnail: "",
      imageTitle: "",
      number: 0,
    });
    console.log(userDataForm);
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
        setUserDataForm({
          ...userDataForm,
          thumnail: imageUrl,
          imageTitle: selectedFile.name,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center px-4 sm:px-0 bg-black/40"
      onClick={closeHandler}
    >
      <div
        className="bg-white rounded-md w-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="" onSubmit={submiteHandler}>
          {/* left section */}
          <div className="p-6 px-8 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className=" md:text-4xl text-[28px] font-bold text-gray-700 font-mavenPro">
                User Form
              </h2>
              <button onClick={closeHandler}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 hover:text-orange-600 text-sky-600" />
              </button>
            </div>
            <div className="h-[calc(100vh-17rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
              <div className="text-white h-[160px] md:h-[200px] bg-blue-50 rounded-md ">
                {userDataForm.thumnail ? (
                  <img
                    src={userDataForm?.thumnail}
                    alt={userDataForm?.imageTitle}
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
              <div className="grid grid-cols-1 gap-2 py-4 md:grid-cols-2 md:gap-4 ">
                {/* <div className="w-full font-mavenPro"> */}
                <input
                  value={userDataForm?.name}
                  type="text"
                  onChange={handleChange}
                  name="name"
                  className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                  placeholder={"Enter Name"}
                  required
                />
                {/* <div className="grid grid-cols-1 col-span-1 gap-4 md:grid-cols-2 md:col-span-2"> */}
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
                    {userDataForm.imageTitle || "Choose a file"}
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
                {/* </div> */}
                <input
                  value={userDataForm?.email}
                  type="email"
                  onChange={handleChange}
                  name="email"
                  className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                  placeholder={"Enter Email"}
                  required
                />
                <input
                  value={userDataForm?.number || ""}
                  type="number"
                  onChange={handleChange}
                  name="number"
                  className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                  placeholder={"Enter Phone number"}
                  required
                />
              </div>

              <div className="flex ">
                <button
                  className="px-4 py-2 text-white bg-[#1f3c88] rounded hover:bg-[#2950b1]"
                  type="submit"
                >
                  {/* Save Changes */}
                  Submit
                </button>
                <button
                  className="px-4 py-2 ml-8 text-white bg-red-500 rounded hover:bg-red-400"
                  onClick={closeHandler}
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

export default CreatUser;
