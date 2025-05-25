// Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";

import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import { MdDirectionsSubway } from "react-icons/md";

import BlogICONSVG from "../../assets/SVG/blogICON";
import CategoryICONSVG from "../../assets/SVG/categoryICON";
import VideoICONSVG from "../../assets/SVG/videoICON";
import AwareNessSVG from "../../assets/SVG/arenessICON";
import SponorSVG from "../../assets/SVG/sponsor.ICON";
import DocumentSVG from "../../assets/SVG/documentICON";
import UserSVG from "../../assets/SVG/userICON";
import QuizIcon from "../../assets/SVG/quizIcon";
import TestIcon from "../../assets/SVG/testICON";

import DailytaskICON from "../../assets/SVG/dailytaskICON";
import PostDetails from "../../assets/SVG/postDetails";
import IconReportTwentyFour from "../../assets/SVG/IconReportTwentyFour";
import IconSettingsOutline from "../../assets/SVG/IconSettingsOutline";

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ width: number; height: number; fill: string }>;
}

const sidebarData: SidebarItem[] = [
  {
    name: "Post Details",
    path: "/post-details",
    icon: PostDetails,
  },
  {
    name: "Blogs",
    path: "/creat-blog",
    icon: BlogICONSVG,
    // icon: <BlogICONSVG width={20} heignt={20} fill={"#9ca3af"} />,
  },
  {
    name: "Blog Category",
    path: "/blogcategory",
    icon: CategoryICONSVG,
  },

  {
    name: "Video",
    path: "/videos",
    icon: VideoICONSVG,
  },
  {
    name: "Video Category",
    path: "/videocategory",
    icon: CategoryICONSVG,
  },
  {
    name: "Awareness",
    path: "/awareness",
    icon: AwareNessSVG,
  },
  {
    name: "Awareness Category",
    path: "/awarenes-category",
    icon: CategoryICONSVG,
  },
  {
    name: "Sponsor",
    path: "/sponsor",
    icon: SponorSVG,
  },
  {
    name: "Imp Document",
    path: "/important-document",
    icon: DocumentSVG,
  },
  {
    name: "Users",
    path: "/users",
    icon: UserSVG,
  },
  {
    name: "Quiz",
    path: "/quiz",
    icon: QuizIcon,
  },
  {
    name: "Test",
    path: "/test",
    icon: TestIcon,
  },
  {
    name: "Daily Task",
    path: "/daily-task",
    icon: DailytaskICON,
  },
  {
    name: "Quiz & Test Category",
    path: "/qt-category",
    icon: CategoryICONSVG,
  },
  {
    name: "Report",
    path: "/report",
    icon: IconReportTwentyFour,
  },
  {
    name: "App Update Settings",
    path: "/update",
    icon: IconSettingsOutline,
  },

  // {
  //   name: "Railway History",
  //   path: "/history",
  //   icon: UserSVG,
  // },
  // {
  //   name: "MCB & Switches",
  //   path: "/mcb-switches",
  //   icon: UserSVG,
  // },
  // {
  //   name: "E-Store",
  //   path: "/store",
  //   icon: UserSVG,
  // },
  // {
  //   name: "Finance",
  //   path: "/finance",
  //   icon: UserSVG,
  // },
];

interface subProps {
  large: boolean;
  small: boolean;
}

interface Props {
  isOpen: subProps;
  onToggleSidebarLarge: () => void;
  onToggleSidebarSmall: () => void;
}
const SideBar = ({
  isOpen,
  onToggleSidebarLarge,
  onToggleSidebarSmall,
}: Props) => {
  return (
    <section
      className={` h-screen border-r border-gray-200  ${isOpen.small
        ? "fixed inset-0 bg-black/60 flex z-30 "
        : ` md:inline-block hidden  transition-all duration-500 ${isOpen.large ? "w-24" : "w-60"
        }`
        }  transition-all duration-500   cursor-pointer`}
    >
      <section
        className={`
    cursor-default h-full bg-white shadow-md overflow-clip   ${isOpen.small ? "w-full sm:w-64" : ""
          }`}
      >
        <div
          className={` ${isOpen.large ? "justify-center" : isOpen.small ? "" : "pl-6"
            } flex w-full gap-2 px-3  pt-6 `}
        >
          <button
            onClick={onToggleSidebarLarge}
            className={`${isOpen.small ? "hidden" : ""}`}
          >
            {!isOpen.large ? (
              <RxHamburgerMenu className="w-6 h-6 text-gray-400" />
            ) : (
              <RxCross1 className="w-6 h-6 text-gray-400" />
            )}
          </button>

          <div className={`w-full ml-4 ${isOpen.large ? "hidden" : ""}`}>
            {/* Loco App Admin */}
            <p className="flex items-center gap-1 text-3xl font-semibold text-gray-800 ">
              {/* Laz<span className="text-emerald-500">y</span>{" "}
              <GiBatMask className="text-emerald-600" />{" "}
              <span className="text-emerald-700">B</span>at */}
              {/* <span className="p-2 bg-blue-200 rounded-full"> */}
              <MdDirectionsSubway className="w-8 h-8 text-blue-800" />
              {/* </span> */}
              <span className="mb-1 font-bold rounded-md font-mavenPro">
                <span className="text-blue-800">L</span>o
                <span className="text-blue-800">c</span>o
              </span>
            </p>
          </div>
          {/* <img
            src={logoFirstWord}
            alt="Logo"
            className={` ${isOpen ? "" : "hidden"}`}
          /> */}
        </div>

        <div
          className={`w-full h-[calc(100vh-6rem)] mt-2 ${isOpen.large ? "p-4" : "  p-2 pt-4 pl-4 "
            }  overflow-y-auto  [&::-webkit-scrollbar]:hidden `}
        >
          {sidebarData.map((sideData) => {
            const isActive = location.pathname.includes(sideData.path);

            return (
              <NavLink
                key={sideData.path}
                to={`${sideData.path}`}
                className={({ isActive }) =>
                  ` relative group rounded-md border-l-4 transition-all duration-500  flex font-medium items-center
                    ${isOpen.large
                    ? "m-0 p-1 justify-center"
                    : "m-1 p-2 w-[95%]"
                  } h-[2.7rem]   ${isActive
                    ? " border-blue-800 bg-blue-200 text-blue-800 font-semibold"
                    : "hover:bg-blue-200 hover:text-gray-800 text-gray-400 border-transparent"
                  }`
                }
              >
                <sideData.icon
                  width={20}
                  height={20}
                  fill={isActive ? "blue" : "#9ca3af"}
                />

                <span
                  className={`mx-1 p-1  text-sm font-montserrat ${isOpen.large ? "hidden" : ""
                    } `}
                >
                  {sideData.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </section>
      <button
        onClick={onToggleSidebarSmall}
        className={`absolute top-6 right-4 z-50 p-1 bg-white rounded-md text-black hover:text-rose-400 ${isOpen.small ? "" : "hidden"
          }`}
      >
        <RxCross1 className="w-6 h-6 font-bold" />
      </button>
      {/* </section> */}
    </section>
  );
};

export default SideBar;
