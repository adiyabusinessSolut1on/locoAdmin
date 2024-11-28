import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Header from "../components/navigation/Header";
import SideBar from "../components/navigation/SideBar";

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState({
    large: false,
    small: false,
  });

  const navigate = useNavigate();

  const toggleSidebarLarge = () => {
    setSidebarOpen((prev) => ({
      ...prev,
      large: !prev.large,
    }));
  };
  const toggleSidebarSmall = () => {
    setSidebarOpen((prev) => ({
      ...prev,
      small: !prev.small,
    }));
  };

  useEffect(() => {
    if (location.pathname === "/") navigate("/post-details");
  }, [navigate]);

  return (
    <main className={`relative flex   min-h-screen bg-[#FAFAFA]`}>
      {/* <main className={`relative flex   min-h-screen bg-[#EFF6FF]`}> */}
      <ToastContainer />

      <SideBar
        isOpen={isSidebarOpen}
        onToggleSidebarLarge={toggleSidebarLarge}
        onToggleSidebarSmall={toggleSidebarSmall}
      />
      <div className="relative  flex-1 overflow-x-hidden [&::-webkit-scrollbar]:hidden">
        <Header
          onToggleSidebarSmall={toggleSidebarSmall}
          isOpen={isSidebarOpen}
        />
        <div className=" mt-20  h-[calc(100vh-5rem)] ">
          <Outlet />
        </div>
      </div>
    </main>
  );
};
export default Layout;
