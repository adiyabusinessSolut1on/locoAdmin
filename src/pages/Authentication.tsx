import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Authentication = () => {
  return (
    <section className="flex md:px-4 max-w-[1200px] mx-auto font-lato">
      <Link
        to={"/"}
        className="fixed top-0 flex items-center gap-1 pt-4  group right-[58px]"
      >
        <span className="group-hover:text-rose-600">Back to home</span>
        <IoMdArrowRoundBack className="transition-all duration-700 rotate-180 group-hover:translate-x-1 group-hover:text-rose-600" />
      </Link>
      <ToastContainer />
      <Outlet />
    </section>
  );
};

export default Authentication;
