
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { TiArrowBackOutline } from "react-icons/ti";
import ProductsLoading from "./ProductsLoading"; // Assuming you have the ProductsLoading component

const SponsorCompanyProfileLoading = () => {
  return (
    <div
      className={`w-full p-6 mx-4 bg-white text-gray-600 border-gray-200 rounded-md md:p-8`}
    >
      <div className="flex items-center">
        <HiOutlineOfficeBuilding className="w-9 h-9" />
        <h1 className="text-[28px] font-bold md:text-4xl ml-2">
          Sponsore Company
        </h1>
        <TiArrowBackOutline className="w-10 h-10 ml-4 text-sky-600" />
      </div>
      <div className="pt-4 border-b border-gray-200"></div>
      <div className="pt-4 mt-4 md:pl-4 font-montserrat">
        <section className="mb-8">
          <div className="">
            <div className="relative flex items-center justify-between w-full mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-700 animate-pulse"></div>
                <div>
                  <div className="w-24 h-6 mb-2 rounded-md bg-slate-700 animate-pulse"></div>
                  <div className="w-16 h-4 rounded-md bg-slate-700 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="grid grid-cols-1 col-span-3 gap-6 md:grid-cols-3">
                <div className="w-full h-6 rounded-md bg-slate-700 animate-pulse"></div>
                <div className="w-full h-6 rounded-md bg-slate-700 animate-pulse"></div>
                <div className="w-full h-6 rounded-md bg-slate-700 animate-pulse"></div>
                <div className="w-full h-6 rounded-md bg-slate-700 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full h-full max-w-full rounded-md font-philosopher">
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <div className="w-64 h-10 rounded-md bg-slate-700 animate-pulse"></div>
            </div>
            <div className="relative flex items-center self-end">
              <div className="w-32 h-10 rounded-md bg-slate-700 animate-pulse"></div>
            </div>
          </div>
          <section className="w-full overflow-auto bg-white border-2 border-gray-200 rounded-lg shadow-md">
            <section className="grid grid-cols-customProduct pb-2 p-2 gap-4 min-w-[1000px] font-medium md:font-semibold bg-white">
              <div className="w-12 h-6 pl-2 rounded-md bg-slate-700 animate-pulse"></div>
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="w-32 h-6 rounded-md bg-slate-700 animate-pulse"
                ></div>
              ))}
            </section>
            <div className="h-[380px] overflow-y-auto min-w-[1000px] bg-gray-50">
              <ProductsLoading />
            </div>
          </section>
          <div className="flex justify-center mt-4">
            {[1, 2, 3].map((page) => (
              <div
                key={page}
                className="w-8 h-8 mx-1 rounded-full bg-slate-700 animate-pulse"
              ></div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SponsorCompanyProfileLoading;
