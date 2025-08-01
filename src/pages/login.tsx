import { useState } from "react";
import { UseCreatePostMutationType, useCreatePostMutation } from "../api/index";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import loginImg from "../assets/login_3.svg";
import { useDispatch } from "react-redux";
import { setUserToken } from "../store/auth";
import React from "react";

interface LoginData {
  email: string;
  password: string;
  role: string;
  otp?:number
}

const Login = () => {
  const navigate = useNavigate();
  const [createPost] = useCreatePostMutation() as UseCreatePostMutationType;
  const [logindata, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
    role: "admin",
    otp:undefined
  });

  const [isOtps,setIsotp]=useState(false)
  const [isVisible, setVisible] = useState(false);
  const dispatch = useDispatch();
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const backLogin=()=>{
    setLoginData({
      email: "",
      password: "",
      role: "admin",
      otp:undefined
    })
    setIsotp(false)
  }

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    createPost({
      data: {email:logindata?.email,otp:Number(logindata?.otp)},
      path: "/loginotp/verify",
    })
      .then((res) => {
        console.log(res);
        if (res?.data?.success&&res?.data?.token) {
          localStorage.setItem("user", res?.data?.token);
          dispatch(setUserToken(res?.data?.token));
          toast.success(res?.data?.message, {
            autoClose: 3000,
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.error("Some error occurred check your credentials");
        }
      })
      .catch(() => {
        toast.error(`Data is wrong`);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost({
      data: {...logindata},
      path: "/login",
    })
      .then((res) => {
        console.log(res);
        if (res?.data?.success) {
          // Check if this is admin login (direct login without OTP)
          if (res?.data?.isAdmin && res?.data?.token) {
            localStorage.setItem("user", res?.data?.token);
            dispatch(setUserToken(res?.data?.token));
            toast.success(res?.data?.message, {
              autoClose: 3000,
            });
            setTimeout(() => {
              navigate("/");
            }, 2000);
          } 
          // For regular users, show OTP input
          else if (res?.data?.requiresOTP) {
            setIsotp(true);
            toast.success(res?.data?.message, {
              autoClose: 3000,
            });
          }
        } else {
          toast.error("Some error occurred check your credentials");
        }
      })
      .catch(() => {
        toast.error(`Data is wrong`);
      });
  };

  return (
    <React.Fragment>
      <ToastContainer/>
      
     {isOtps?<div className="flex flex-col items-center justify-center h-screen px-4 mx-auto  w-[100%]  sm:w-[80%] md:w-[50%]  lg:w-[40%]">
        <div className="">
          <h4 className="text-[24px] md:text-3xl lg:text-4xl font-bold pb-2 text-gray-600">
            Enter OTP
          </h4>
        </div>
        <form
          className="flex flex-col items-center justify-center w-full py-4 lg:p-8"
          onSubmit={verifyOtp}
        >
          <div className="relative w-full mb-4 lg:mb-6">
            <FiLock className="absolute w-5 h-5 text-gray-400 top-[10px] left-2" />
            <input
              className="w-full px-8 py-[6px]  bg-blue-50 transition-all duration-200 border-2 rounded-md outline-none placeholder:text-gray-400 pl-9 focus:border-blue-300"
              onChange={handleChange}
              value={logindata?.otp}
              name="otp"
              type="number" 
              required
              placeholder="OTP"
            />
            <button
              className="absolute text-gray-400 right-4 top-[10px]"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                setVisible((prev) => !prev);
              }}
            >
              {isVisible ? (
                <FiEye className="w-5 h-5 text-blue-400" />
              ) : (
                <FiEyeOff className="w-5 h-5 " />
              )}
            </button>
          </div>

          <div className="grid w-full pb-2">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-[#1F3C88] border rounded-md disabled:bg-gray-600 hover:bg-[#1f5e88]"
            >
              Submit
            </button>
          </div>
          <div className="mt-2 text-sm ">
            <div
              onClick={backLogin}
              className="cursor-pointer ml-2 text-blue-500 font-medium  border-b border-transparent   hover:text-blue-600 transition-all duration-500  w-[fit-content]"
            >
              Back to Login
            </div>
          </div>
        </form>
      </div>:<div className="flex flex-col items-center justify-center h-screen px-4 mx-auto  w-[100%]  sm:w-[80%] md:w-[50%]  lg:w-[40%]">
        <div className="">
          <h4 className="text-[24px] md:text-3xl lg:text-4xl font-bold pb-2 text-gray-600">
            Log in to your Account
          </h4>
          <p className="text-sm font-medium text-gray-600 sm:text-base">
            Welcome back! Please Login to continue
          </p>
        </div>
        <form
          className="flex flex-col items-center justify-center w-full py-4 lg:p-8"
          onSubmit={handleSubmit}
        >
          <div className="relative w-full">
            <FiUser className="absolute w-5 h-5 text-gray-400 top-[10px] left-2" />
            <input
              className="w-full py-[6px] mb-4 transition-all duration-200 border-2 rounded-md outline-none bg-blue-50 placeholder:text-gray-400 pl-9 focus:border-blue-300"
              onChange={handleChange}
              value={logindata.email}
              name="email"
              type="email"
              required
              placeholder="Email"
            />
          </div>
          <div className="relative w-full mb-4 lg:mb-6">
            <FiLock className="absolute w-5 h-5 text-gray-400 top-[10px] left-2" />
            <input
              className="w-full px-8 py-[6px]  bg-blue-50 transition-all duration-200 border-2 rounded-md outline-none placeholder:text-gray-400 pl-9 focus:border-blue-300"
              onChange={handleChange}
              value={logindata.password}
              name="password"
              type={`${isVisible ? "text" : "password"}`}
              required
              placeholder="Password"
            />
            <button
              className="absolute text-gray-400 right-4 top-[10px]"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                setVisible((prev) => !prev);
              }}
            >
              {isVisible ? (
                <FiEye className="w-5 h-5 text-blue-400" />
              ) : (
                <FiEyeOff className="w-5 h-5 " />
              )}
            </button>
          </div>

          <div className="grid w-full pb-2">
            <p className="flex flex-col pb-4 lg:pb-8 justify-self-end">
              <Link
                to="/login/forgot-password"
                className="text-blue-500 font-medium text-sm border-b border-transparent hover:border-blue-500 hover:text-blue-600 transition-all duration-500  w-[fit-content]"
              >
                Forgot Your Password ?
              </Link>
            </p>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-[#1F3C88] border rounded-md disabled:bg-gray-600 hover:bg-[#1f5e88]"
            >
              Login
            </button>
          </div>
        </form>
      </div>} 
     
      <div className="flex-col items-center justify-center hidden h-screen rounded-md md:flex">
        <img src={loginImg} alt="login image" className="w-full h-full" />
      </div>
    </React.Fragment>
  );
};

export default Login;
