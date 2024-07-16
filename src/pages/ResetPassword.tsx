import  {  useState } from "react";
import {  useNavigate } from "react-router-dom";
import resetImg from "../assets/Secure login.svg";

import { FiEye, FiEyeOff, FiInbox, FiLock, FiUser } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import { useCreatePostMutation } from "../api";

const ResetPasswordForm = () => {
  const [resetPassword, setResetPassword] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });

  const [passwordError, setPassWordError] = useState({
    confirmPasswordMsg: "",
    otpMessage: "",
  });

  const [isVisible, setVisible] = useState({
    enterPass: false,
    confPass: false,
  });

  const navigate = useNavigate();

  const handleChangePassword = (e:React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword =
      e.target.name === "confirmPassword" && e.target.value;

    setResetPassword((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

    if (confirmPassword === resetPassword.newPassword) {
      setPassWordError((prev) => ({
        ...prev,
        confirmPasswordMsg: "",
      }));
    }

    if (resetPassword.otp.length === 6) {
      setPassWordError((prev) => ({
        ...prev,
        otpMessage: "",
      }));
    }
  };

  const [createPost] = useCreatePostMutation();

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();

    if (
      resetPassword.confirmPassword !== resetPassword.newPassword &&
      resetPassword.otp.length !== 6
    ) {
      setPassWordError({
        confirmPasswordMsg: "Password does not match",
        otpMessage: "Please enter a valid OTP",
      });
      return;
    }
    if (resetPassword.otp.length !== 6) {
      setPassWordError((prev) => ({
        ...prev,
        otpMessage: "Please enter a valid OTP",
      }));
      return;
    } else {
      setPassWordError((prev) => ({
        ...prev,
        otpMessage: "",
      }));
    }

    toast.loading("Checking Passwords");

    const resetPasswordObj = {
      email: resetPassword.email,
      newPassword: resetPassword.newPassword,
      otp: resetPassword.otp,
    };

    createPost({
      data: resetPasswordObj,
      path: "/verifyotp",
    })
      .then((res) => {
        if (res.data.success) {
          toast.dismiss();
          toast.success(`Password Successfully Change`);

          navigate("/login");
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Please put correct Email");
      });
    setResetPassword({
      otp: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <>
    <ToastContainer/>
      <div className="flex flex-col items-center justify-center h-screen px-4 mx-auto w-[100%]  sm:w-[80%]  lg:w-[50%]">
        <div className="w-full lg:pl-8">
          <h4 className="text-[24px] md:text-3xl lg:text-4xl font-bold text-gray-600">
            Reset Password!
          </h4>
          <p className="text-gray-600 md:pt-2">Create a new password!</p>
        </div>

        <form
          className="flex flex-col items-center justify-center w-full py-4 lg:p-8"
          onSubmit={handleSubmit}
        >
          <div className="relative w-full">
            <FiUser className="absolute w-5 h-5 text-gray-400 top-[10px] left-2" />
            <input
              className="w-full px-8 py-[6px] mb-4 transition-all duration-200 border-2 rounded-md outline-none placeholder:text-gray-400 pl-9 bg-blue-50 focus:border-blue-300"
              name="email"
              type={"text"}
              placeholder="Enter Email"
              value={resetPassword.email}
              onChange={handleChangePassword}
              required
            />
          </div>
          <div className="relative w-full">
            <FiLock className="absolute w-5 h-5 text-gray-400 top-[10px] left-2" />
            <input
              className="w-full px-8 py-[6px] mb-4 transition-all duration-200 border-2 rounded-md outline-none placeholder:text-gray-400 pl-9 bg-blue-50 focus:border-blue-300"
              name="newPassword"
              type={`${isVisible.enterPass ? "text" : "password"}`}
              placeholder="Enter new password"
              value={resetPassword.newPassword}
              onChange={handleChangePassword}
              required
            />
            <button
              className="absolute text-gray-400 right-4 top-[10px]"
              role="button"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of the button
                setVisible((prev) => ({
                  ...prev,
                  enterPass: !prev.enterPass,
                })); // Toggle password visibility
              }}
            >
              {isVisible.enterPass ? (
                <FiEye className="w-5 h-5 text-blue-400" />
              ) : (
                <FiEyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="relative w-full mb-4">
            <FiLock className="absolute w-5 h-5 text-gray-400 top-[10px] left-2" />
            <input
              className="w-full px-8 py-[6px]  transition-all duration-200 border-2 rounded-md outline-none bg-blue-50 placeholder:text-gray-400 pl-9 focus:border-blue-300"
              name="confirmPassword"
              type={`${isVisible.confPass ? "text" : "password"}`}
              placeholder="Confirm new password"
              value={resetPassword.confirmPassword}
              onChange={handleChangePassword}
              required
            />
            <button
              className="absolute text-gray-400 right-4 top-[10px]"
              role="button"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior of the button
                setVisible((prev) => ({
                  ...prev,
                  confPass: !prev.confPass,
                })); // Toggle password visibility
              }}
            >
              {isVisible.confPass ? (
                <FiEye className="w-5 h-5 text-blue-400" />
              ) : (
                <FiEyeOff className="w-5 h-5" />
              )}
            </button>
            {passwordError.confirmPasswordMsg && (
              <div className="pt-1 text-sm text-red-500 ">
                {passwordError.confirmPasswordMsg} !
              </div>
            )}
          </div>
          <div className="relative w-full mb-8">
            <FiInbox className="absolute w-5 h-5 text-gray-400 top-[10px] left-2" />
            <input
              type="number"
              name="otp"
              className="w-full px-8 py-[6px]  transition-all duration-200 border-2 rounded-md outline-none bg-blue-50 placeholder:text-gray-400 pl-9 focus:border-blue-300"
              value={resetPassword.otp}
              onChange={handleChangePassword}
              placeholder="Place OTP here "
            />
            {passwordError.otpMessage && (
              <div className="pt-1 text-sm text-red-500 ">
                {passwordError.otpMessage} !
              </div>
            )}
          </div>

          <div className="flex items-center justify-between w-full">
            <button
              className="px-4 py-2 font-bold text-white bg-[#1F3C88]  rounded-md disabled:bg-gray-600 hover:bg-[#1f5e88] focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
      <div className="flex-col items-center justify-center hidden h-screen rounded-md md:flex">
        <img
          src={resetImg}
          alt="reset password image"
          className="w-full h-full"
        />
      </div>
    </>
  );
};

export default ResetPasswordForm;
