
import { useState } from "react";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";

import { FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router";

import LogOutModal from "../modal/LogoutModal";
import { MdDirectionsSubway } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import CreatNotification from "../../forms/CreatNotification";
interface Props {
  isOpen: {
    small: boolean;
    large: boolean;
  };
  onToggleSidebarSmall: () => void;
}

const Header = ({ onToggleSidebarSmall, isOpen }: Props) => {
  const [isLogout, setLogoutModal] = useState(false);
  const [showNotification, setNotification] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logged out");
    setLogoutModal(true);
 
  };

  const profilePannelHanlder = () => {
    handleLogout();
  };

  const handlingNotification = () => {
    setNotification((prev) => !prev);
  };


  const getDateString = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    return `${day} ${month}`;
  };

  const getTimeString = (dateString: string) => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const date = new Date().toISOString();

  const time = getTimeString(date);
  const dateMonth = getDateString(date);

  const cancelLogout = () => {
    setLogoutModal(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <>
      {isLogout && (
        <LogOutModal onClose={cancelLogout} onConfirm={confirmLogout} />
      )}
      {showNotification && (
        <CreatNotification setCategoryForm={setNotification} />
      )}

      <header
        className={`fixed top-0 flex items-center justify-between border-b bg-[#FAFAFA] border-gray-200 w-full  ${
          !isOpen.large
            ? "md:w-[calc(100vw-15.4rem)]"
            : "lg:w-[calc(100%-5.4rem)]"
        } h-20   z-10`}
      >
        <div className="grid w-full h-full grid-cols-2 mx-4 md:grid-cols-1 md:mr-6 md:mx-0 ">
          <div className="flex items-center h-full gap-2 px-2 md:hidden">
            <button
              onClick={onToggleSidebarSmall}
              className="flex items-center"
            >
              {!isOpen.small ? (
                <RxHamburgerMenu className="w-6 h-5 text-gray-600" />
              ) : (
                <RxCross1 className="w-6 h-6 text-gray-600" />
              )}
            </button>
           
            <p className="flex items-center gap-1 text-3xl font-semibold text-gray-800 ">
              <MdDirectionsSubway className="w-8 h-8 text-blue-800" />

              <span className="mb-1 font-bold rounded-md font-mavenPro">
                <span className="text-blue-800">L</span>o
                <span className="text-blue-800">c</span>o
              </span>
            </p>
          </div>
          <div className="md:w-1/2 lg:w-[30%]  items-center justify-self-end flex gap-4 lg:gap-8 justify-end  relative">
            {/* notification */}
            <div className="relative flex items-center">
              <IoMdNotifications
                className={`${
                  showNotification ? "text-blue-400" : "text-blue-300"
                } cursor-pointer w-7 h-7 hover:text-blue-400`}
                onClick={handlingNotification}
              />
              <span className="absolute flex w-2 h-2 top-1 right-1">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-sky-700"></span>
                <span className="relative inline-flex w-2 h-2 rounded-full bg-sky-700"></span>
              </span>
            </div>
           
            <div className="flex items-center justify-start font-bold text-green-800 md:w-1/2 font-lato">
              {/* time */}
              <div className="pr-2 text-xs border-r border-green-800 md:text-sm">
                {time}
              </div>
              {/* date and month */}
              <div className="pl-2 text-xs md:text-sm ">{dateMonth}</div>
            </div>
            {/* user Profile */}
            <div
              className={`flex items-center  gap-4 p-1  cursor-pointer rounded-md z-4  `}
              onClick={profilePannelHanlder}
             
            >
             
              <div className={`flex items-center justify-center p-1`}>
               
                <FaUserCog
                  className={` cursor-pointer w-8 h-8  text-green-800 `}
                />
              
              </div>
         
            </div>
          
          </div>
         
        </div>
      </header>
    </>
  );
};

export default Header;
