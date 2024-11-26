import { useLocation, useNavigate } from "react-router-dom";
import BlogICONSVG from "../assets/SVG/blogICON";
import CategoryICONSVG from "../assets/SVG/categoryICON";
import VideoICONSVG from "../assets/SVG/videoICON";
import AwareNessSVG from "../assets/SVG/arenessICON";
import SponorSVG from "../assets/SVG/sponsor.ICON";
import DocumentSVG from "../assets/SVG/documentICON";
import UserSVG from "../assets/SVG/userICON";
const Sidebar = () => {
  const router = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  return (
    <div className="flex flex-col w-64 h-screen p-5 bg-white shadow-md">
      <div className="menu-item flex items-center p-2 mb-2  text-blue-900  cursor-pointer border-b-2 text-[20px] font-[600]">
        Loco App Admin
      </div>

      {sidebarData?.map((item, index: number) => {
        return (
          <div key={index} onClick={() => router(item.path)} className={` ${item?.path === pathName ? "bg-blue-900 text-white active" : "text-black hover:bg-gray-100"} menu-item flex items-center p-2 mb-2 rounded-md   cursor-pointer`}>
            <span className="mr-2 icon">{item?.icon}</span>
            <span className="text ">{item?.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const sidebarData: SidebarItem[] = [
  {
    name: "Blogs",
    path: "/blog",
    icon: <BlogICONSVG width={20} heignt={20} fill={"#9ca3af"} />,
  },
  {
    name: "Blog Category",
    path: "/blogcategory",
    icon: <CategoryICONSVG width={20} heignt={20} fill={"#9ca3af"} />,
  },

  {
    name: "Video",
    path: "/video",
    icon: <VideoICONSVG width={20} heignt={20} fill={"#9ca3af"} />,
  },
  {
    name: "Video Category",
    path: "/videocategory",
    icon: <CategoryICONSVG width={20} heignt={20} fill={"#9ca3af"} />,
  },
  {
    name: "Awareness",
    path: "/awareness",
    icon: <AwareNessSVG width={20} heignt={20} fill={"#9ca3af"} />,
  },
  {
    name: "Awareness Category",
    path: "/awareness-category",
    icon: <AwareNessSVG width={20} heignt={20} fill={"#9ca3af"} />,
  },
  {
    name: "Sponsor",
    path: "/sponsor",
    icon: <SponorSVG width={20} heignt={20} fill={"#9ca3af"} />,
  },
  {
    name: "Important Document",
    path: "/important-document",
    icon: <DocumentSVG width={20} heignt={20} fill={"#9ca3af"} />,
  },
  {
    name: "Users",
    path: "/users",
    icon: <UserSVG width={20} heignt={20} fill={"#9ca3af"} />,
  },
  {
    name: "Daily Task",
    path: "/daily-task",
    icon: <UserSVG width={20} heignt={20} fill={"#9ca3af"} />,
  },
  {
    name: "Railway History",
    path: "/history",
    icon: "",
  },
  {
    name: "MCB & Switches",
    path: "/mcb-switches",
    icon: "",
  },
  {
    name: "E-Store",
    path: "/store",
    icon: "",
  },
  {
    name: "Finance",
    path: "/finance",
    icon: "",
  },
];
