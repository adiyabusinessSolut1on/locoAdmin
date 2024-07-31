import { useState } from "react";
import Switches from "../components/category-switch";

const Create_Category = () => {
  const [tab, setTab] = useState("tab1");
  return (
    <section
      className={`  md:pl-0 p-4 h-full   w-full rounded-md   mx-auto [&::-webkit-scrollbar]:hidden `}
    >
      <section
        className={` md:p-8 p-6 h-full mb-4 border-gray-200 rounded-md  max-w-full w-full `}
      >
        <div className="flex items-center mb-2 md:mb-6">
          <h1 className=" text-[28px] font-bold md:text-4xl text-gray-600 font-mavenPro">
            Blog Category
          </h1>
        </div>
        <div className=" w-auto flex  mb-4 flex-wrap gap-2 md:gap-3  rounded-[5px] ">
          {tablist?.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => setTab(item.value)}
                className={`relative cursor-pointer py-2 px-2 md:px-4 text-sm md:text-base font-semibold  text-[#242424] transition-all duration-300 ease-in-out transform ${
                  tab === item.value
                    ? "scale-105 opacity-100"
                    : "bg-transparent  scale-100 opacity-75"
                }`}
              >
                {item.name}
                <p
                  className={`border-b transition-all duration-300 ${
                    tab === item.value
                      ? "border-[#1E40AF] left-2 right-2 md:left-4 md:right-4"
                      : "border-transparent left-0 "
                  }  absolute inset-0 `}
                ></p>
              </div>
            );
          })}
        </div>
        <section
          className={`w-full overflow-auto   border-2 [&::-webkit-scrollbar]:hidden rounded-lg border-gray-200 shadow-md `}
        >
          {/* <div className="flex flex-col gap-5 w-full  p-10 rounded-[7px]"> */}

          <Switches value={tab} />
          {/* </div> */}
        </section>
      </section>
    </section>
  );
};
export default Create_Category;
interface tablistprops {
  name: string;
  value: string;
}
const tablist: tablistprops[] = [
  {
    name: "Main Category",
    value: "tab1",
  },
  {
    name: "Sub-Category",
    value: "tab2",
  },
  {
    name: "Sub Sub-Category",
    value: "tab3",
  },
  {
    name: "Inner Category",
    value: "tab4",
  },
];



