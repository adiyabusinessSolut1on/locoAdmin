import { useState } from "react";
import Pagination from "../components/pagination/Pagination";
import EditICONSVG from "../assets/SVG/editICON";
import DeleteICONSVG from "../assets/SVG/deleteICON";
import ConfirmDeleteModal from "../components/modal/DeleteModal";
import Loader from "../components/loader";
import { toast, ToastContainer } from "react-toastify";
import { useDeletePostMutation, useGetDataQuery } from "../api";
import { Link } from "react-router-dom";
import { IoIosSend } from "react-icons/io";

import { PiEye } from "react-icons/pi";
import CreatTest from "../forms/CreatTest";
import TestQuestion from "../forms/TestQuestion";
import { Testtypes } from "../types";

const Test = () => {
  //   const navigate = useNavigate();
  const { data, isLoading, error, isError } = useGetDataQuery({
    url: "/test",
  });

  const [deletPost] = useDeletePostMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //calculation of page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentTest = data?.slice(indexOfFirstItem, indexOfLastItem);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const [isTestForm, setTestForm] = useState({
    creat: false,
    updateId: "",
  });

  const [isQuestionForm, setQuestionForm] = useState({
    condition: false,
    isCreat: false,
    data: {
      _id: "",
      name: "",
      image:[],
      options: [],
      predicted_result: "",
      actualresult: "",
      isTrue: false,
      answer_description: "",
    },
    testId: "",
  });

  const [isModalOpen, setModalOpen] = useState({
    condition: false,
    id: "",
  });

  const [isClapm, setClamp] = useState(false);

  const handleCloseModal = () => {
    setModalOpen({
      condition: false,
      id: "",
    });
  };

  const updateHandler = (quiz: Testtypes) => {
    setTestForm((prev) => ({
      ...prev,
      updateId: quiz._id,
    }));
  };

  const deletHandler = (id: string) => {
    setModalOpen((prev) => ({
      ...prev,
      condition: !prev.condition,
      id: id,
    }));
  };

  const handleConfirmDelete = () => {
    // Handle the delete action here
    toast.loading("checking Details");
    deletPost({
      url: `/test/${isModalOpen.id}`,
    })
      .then((res) => {
        if (res.data.success) {
          toast.dismiss();
          toast.success(`${res.data.message}`);
        }
        console.log(res);
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Not successfull to delete");
      });
    setModalOpen({
      condition: false,
      id: "",
    });
  };

  console.log(data, error, "awareness");

  const listHeadingTest = [
    "Title",
    "Category",
    "Instruction",
    "Add Questions",
    "view",
    "Setting",
  ];

  const handlingCrateQuiz = () => {
    setTestForm((prev) => ({
      ...prev,
      creat: !prev.creat,
    }));
  };

  const questionFormHandler = (test: Testtypes) => {
    setQuestionForm((prev) => ({
      ...prev,
      condition: true,
      isCreat: true,
      testId: test?._id,
    }));
  };

  const closeHandler = () => {
    setQuestionForm((prev) => ({
      ...prev,
      condition: false,
      isCreat: false,
      data: {
        _id: "",
        name: "",
        image:[],
        options: [],
        predicted_result: "",
        actualresult: "",
        isTrue: false,
        answer_description: "",
      },
      testId: "",
    }));
  };
  return (
    <>
      <ToastContainer />
      {isLoading && <Loader />}

      {(isTestForm.creat || isTestForm.updateId) && (
        <CreatTest isTestForm={isTestForm} setTestForm={setTestForm} />
      )}
      {isQuestionForm.condition && (
        <TestQuestion
          isQuestionForm={isQuestionForm}
          //   setQuestionForm={setQuestionForm}
          close={closeHandler}
          //   singleQuestionData={updateData}
        />
      )}

      {isModalOpen.condition && (
        <ConfirmDeleteModal
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      )}

      <section
        className={`  md:pl-0 p-4 h-full  w-full rounded-md   mx-auto [&::-webkit-scrollbar]:hidden `}
      >
        <section
          className={` md:p-8 p-6 h-full border-gray-200 rounded-md  max-w-full w-full `}
        >
          <div className="flex items-center mb-2 md:mb-6">
            <h1 className=" text-[28px] font-bold md:text-4xl text-gray-600 font-mavenPro">
              Test
            </h1>
          </div>
          <div className="flex justify-between mb-4">
            <div className={`flex items-center   `}>
              <input
                type="search"
                placeholder={`Search`}
                className={` p-2 text-sm md:text-base  sm:px-4 py-1 border-[2px] border-transparent 
                             bg-slate-50 focus:border-gray-100
                          shadow-inner rounded-[0.26rem] outline-none `}
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                // onFocus={() => setCurrentPage(1)}
              />
            </div>
            <div className="relative flex items-center self-end ">
              <button
                className={` px-2 py-1 
                                     bg-[#1f3c88] hover:bg-[#2d56bb]  text-[#DEE1E2] font-semibold
                                }    rounded shadow-xl md:px-4 md:py-2  sm:self-center`}
                onClick={handlingCrateQuiz}
              >
                <span className="hidden md:inline-block">Creat Test</span>

                <IoIosSend className="w-6 h-6 md:hidden" />
              </button>
            </div>
          </div>
          <section
            className={`w-full overflow-auto   border-2 [&::-webkit-scrollbar]:hidden rounded-lg border-gray-200 shadow-md bg-white`}
          >
            <section className="grid grid-cols-customQuiz pb-2 p-2  gap-4   min-w-[800px] font-medium md:font-semibold bg-white font-mavenPro">
              <p className="pl-2 md:text-lg">SrNo.</p>

              {listHeadingTest.map((heading, index) => (
                <p
                  key={index}
                  className={`   md:text-lg ${
                    index !== 0 ? "justify-self-center" : "ml-20"
                  }`}
                >
                  {heading.charAt(0).toUpperCase() + heading.slice(1)}
                </p>
              ))}
            </section>
            <div className=" h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[800px] bg-gray-50">
              {isLoading ? (
                <p>Loading...</p>
              ) : isError ? (
                <p className="flex items-center justify-center w-full h-full font-medium text-center text-rose-800">
                  Check Internet connection or Contact to Admin
                </p>
              ) : data?.length > 0 ? (
                currentTest?.map((test: Testtypes, i: number) => (
                  <section
                    key={i}
                    className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customQuiz group hover:bg-gray-50"
                  >
                    <span>{i + 1}</span>

                    <span
                      className={`  font-semibold text-center  rounded-full  `}
                    >
                      {test?.title ? test?.title : "---"}
                    </span>
                    <span
                      className={`  font-semibold text-center  rounded-full  `}
                    >
                      {test?.category ? test?.category : "---"}
                    </span>
                    {/* <span
                      className={`  font-semibold text-center  rounded-full  `}
                    >
                      {test?.instructions ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: test?.instructions,
                          }}
                        />
                      ) : (
                        "--"
                      )}
                    </span> */}
                    <div
                      className={`  font-semibold text-center  rounded-full  `}
                    >
                      {test?.instructions ? (
                        // hover:line-clamp-none
                        <>
                          <div
                            className={`line-clamp-3 ${
                              isClapm && "line-clamp-none"
                            }`}
                            dangerouslySetInnerHTML={{
                              __html: test?.instructions,
                            }}
                          />
                          <button
                            className="font-semibold text-gray-500"
                            onClick={() => setClamp((prev) => !prev)}
                          >
                            {isClapm ? "less" : "more"}
                          </button>
                        </>
                      ) : (
                        "--"
                      )}
                    </div>

                    <div className="grid items-center justify-center">
                      <button
                        className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb]"
                        onClick={() => questionFormHandler(test)}
                      >
                        Add Questions
                      </button>
                    </div>
                    <div className="grid items-center justify-center ">
                      <Link
                        to={`/test/${test._id}`}
                        className="px-2 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500"
                      >
                        <PiEye className="w-5 h-5" />
                      </Link>
                    </div>

                    <div className="grid justify-center gap-2">
                      <button
                        className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb]"
                        onClick={() => updateHandler(test)}
                      >
                        {/* Edit */}
                        <EditICONSVG height={18} width={18} fill={"white"} />
                      </button>
                      <button
                        className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-rose-600 hover:bg-rose-700"
                        onClick={() => deletHandler(test._id)}
                      >
                        {/* Delete */}
                        <DeleteICONSVG height={18} width={18} fill={"white"} />
                      </button>
                    </div>
                  </section>
                ))
              ) : (
                <div>Data Not Found</div>
              )}
            </div>
          </section>

          <Pagination<Testtypes>
            currentPage={currentPage}
            apiData={data}
            itemsPerPage={itemsPerPage}
            handleClick={handleClick}
          />
        </section>
      </section>
    </>
  );
};

export default Test;
