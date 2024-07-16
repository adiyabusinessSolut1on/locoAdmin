import { useState } from "react";
import Switches from "../components/category-switch";

const Create_Category = () => {
  const [tab, setTab] = useState("tab1");
  return (
    <div className="p-5 flex flex-wrap  gap-5 bg-blue-100  w-full  ">
      <div className="flex flex-col gap-5 w-full  p-10 rounded-[7px]">
        <div className=" w-auto flex   flex-wrap gap-3 bg-white rounded-[5px] ">
          {tablist?.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => setTab(item.value)}
                className={`cursor-pointer py-2 px-4 font-semibold transition-all duration-300 ease-in-out transform ${
                  tab === item.value
                    ? "bg-[#333] text-[#fff] rounded-[5px] scale-105 opacity-100"
                    : "bg-transparent text-[#242424] scale-100 opacity-75"
                }`}
              >
                {item.name}
              </div>
            );
          })}
        </div>
        <Switches value={tab} />
      </div>
    </div>
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
