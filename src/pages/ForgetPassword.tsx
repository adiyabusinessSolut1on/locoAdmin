/* eslint-disable no-unused-vars */
import  { useState } from "react";
import forgetImg from "../assets/Forgot password.svg";
import { FiUser } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import { useCreatePostMutation } from "../api";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const [createPost] = useCreatePostMutation();
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.loading("Checking Email");
    createPost({
      data: { email: email },
      path: "/forget-password",
    })
      .then((res) => {
        if (res.data.success) {
          console.log(res);
          toast.dismiss();
          toast.success(`Check your Email`);

          navigate("/login/reset-password");
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Please put correct Email");
      });
    setEmail("");
  };

  return (
    <>
    <ToastContainer/>
      <div className="flex flex-col items-center justify-center h-screen px-6 mx-auto w-[100%] sm:w-[80%]  lg:w-[40%]">
        <div className="w-full">
          <h4 className="text-[24px] md:text-4xl font-bold text-gray-600">
            Forgot Password!
          </h4>
          <p className="pt-1 text-sm text-gray-600 md:pt-2 md:text-base">
            Don't worry, we've got you covered!
          </p>
        </div>

        <form
          className="flex flex-col items-center justify-center w-full py-4 md:pr-8 "
          onSubmit={handleSubmit}
        >
          <div className="relative w-full">
            <FiUser className="absolute w-5 h-5 text-gray-400 top-[10px] left-2" />
            <input
              className="w-full py-[6px] mb-4 transition-all duration-200 border-2 rounded-md outline-none placeholder:text-gray-400 pl-9 focus:border-blue-300 bg-blue-50"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center w-full ">
            <button
              className="px-4 py-2 font-bold text-white bg-[#1F3C88] rounded-md hover:bg-[#1f5e88] disabled:bg-gray-400 focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={email === ""}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="flex-col items-center justify-center hidden h-screen rounded-md md:flex">
        <img
          src={forgetImg}
          alt="forget password image"
          className="w-full h-full"
        />
      </div>
    </>
  );
};

export default ForgetPassword;
