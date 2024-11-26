import  { useState } from "react";
import Pagination from "../components/pagination/Pagination";
import { Link, useParams } from "react-router-dom";
import { useDeletePostMutation, useGetDataQuery } from "../api";
import { toast, ToastContainer } from "react-toastify";
import { MdOutlineQuiz } from "react-icons/md";
import { TiArrowBackOutline } from "react-icons/ti";
import { IoIosSend } from "react-icons/io";
import ConfirmDeleteModal from "../components/modal/DeleteModal";
import TestQuestion from "../forms/TestQuestion";
import { TestQuestionsType } from "../types";
interface stateProps{
  condition: boolean,
  isCreat: boolean,
  data: {
    _id:string,
    name:string[],
    options:string[],
    predicted_result:string,
    actualresult:string,
    isTrue:boolean,
    answer_description:string
  },
  testId: string,
}
const TestProfile = () => {
  const { id } = useParams();
  const { data, isLoading,  isError } = useGetDataQuery({
    url: `/test/${id}`,
  });

  console.log(data, "pagination");

  const [isQuestionForm, setQuestionForm] = useState<stateProps>({
    condition: false,
    isCreat: false,
    data: {
      _id:"",
      name:[],
      options:[],
      predicted_result:"",
      actualresult:"",
      isTrue:false,
      answer_description:""
    },
    testId: "",
  });

  const listHeadingProducts = ["Question", "Option", "Answer", "Setting"];

  const questionFormHandler = () => {
    setQuestionForm((prev) => ({
      ...prev,
      condition: true,
      isCreat: true,
      testId: data?._id,
    }));
  };

  const closeHandler = () => {
    setQuestionForm((prev) => ({
      ...prev,
      condition: false,
      isCreat: false,
      data: {
        _id:"",
        name:[],
        options:[],
        predicted_result:"",
        actualresult:"",
        isTrue:false,
        answer_description:""
      },
      testId: "",
    }));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  //calculation of page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentQuestion = data?.questions?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const [deletPost] = useDeletePostMutation();

  const [isModalOpen, setModalOpen] = useState({
    condition: false,
    id: "",
  });

  const handleCloseModal = () => {
    setModalOpen({
      condition: false,
      id: "",
    });
  };

  const deletHandler = (id:string) => {
    console.log(id, "from handler");
    setModalOpen((prev) => ({
      ...prev,
      condition: !prev.condition,
      id: id,
    }));
  };

  const updateHandler = (testData:TestQuestionsType) => {
    setQuestionForm((prev) => ({
      ...prev,
      condition: true,
      isCreat: false,
      data: testData,
    }));
  };

  const handleConfirmDelete = () => {
    // Handle the delete action here
    toast.loading("checking Details");

    deletPost({
      url: `/test/question/${isModalOpen.id}`,
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
  return (
    <>
    <ToastContainer/>
      {isModalOpen.condition && (
        <ConfirmDeleteModal
       
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isQuestionForm.condition && (
        <TestQuestion close={closeHandler} isQuestionForm={isQuestionForm} />
      )}

      {isLoading ? (
        //   <SponsorCompanyProfileLoading />
        <p>Loading...</p>
      ) : (
        <div
          className={`w-full p-6   
                 
                     text-gray-600 border-gray-200   rounded-md md:p-8`}
        >
          <div className="flex items-center">
            <MdOutlineQuiz className=" w-9 h-9" />
            <h1 className="  text-[28px] font-bold  md:text-4xl ml-2 font-mavenPro">
              Test Area
            </h1>
            <Link to={"/test"}>
              <TiArrowBackOutline className="w-10 h-10 ml-4 hover:text-orange-600 text-sky-600" />
            </Link>
          </div>
          <div className="pt-4 border-b border-gray-200"></div>
          <div className="pt-4 mt-4 md:pl-4 font-montserrat">
            <section className="mb-8 ">
              <div className="">
                <div className="relative flex items-center justify-between w-full mb-8">
                  <div className="flex items-center gap-4">
                    {/* <div> */}
                    <h2 className="text-xl font-semibold text-blue-800 md:text-2xl font-mavenPro">
                      {data?.title}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
                  <p className="text-sm font-semibold md:text-base">
                    <span className="pr-2 text-sm text-gray-500 ">
                      instructions
                    </span>
                    {data?.instructions}
                  </p>
                </div>
              </div>
            </section>
            <section
              className={`  h-full rounded-md  font-philosopher max-w-full w-full `}
            >
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
                    onClick={questionFormHandler}
                  >
                    {/* <Link to={`/sponsor/profile/${id}/product_form`}> */}
                    <p>
                      <span className="hidden md:inline-block">
                        Add Question
                      </span>

                      <IoIosSend className="w-6 h-6 md:hidden" />
                    </p>
                  </button>
                </div>
              </div>
              <section
                className={`w-full overflow-auto   border-2 [&::-webkit-scrollbar]:hidden rounded-lg border-gray-200 shadow-md bg-white`}
              >
                <section className="grid grid-cols-customQuizQuestion pb-2 p-2  gap-4   min-w-[800px] font-medium md:font-semibold bg-white font-mavenPro">
                  <p className="pl-2 md:text-lg">SrNo.</p>

                  {listHeadingProducts.map((heading, index) => (
                    <p
                      key={index}
                      className={`   md:text-lg ${
                        index == 3 ? "justify-self-center" : "ml-16"
                      }`}
                    >
                      {heading.charAt(0).toUpperCase() + heading.slice(1)}
                    </p>
                  ))}
                </section>
                <div className=" h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[800px] bg-gray-50">
                  {isError ? (
                    <p className="flex items-center justify-center w-full h-full font-medium text-center text-rose-800">
                      Check Internet connection or Contact to Admin
                    </p>
                  ) : data?.questions.length !== 0 ? (
                    currentQuestion?.map((question:TestQuestionsType, i:number) => (
                      <section
                        key={i}
                        className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customQuizQuestion group hover:bg-gray-50"
                      >
                        <span>{i + 1}</span>

                        <span
                          className={`  font-semibold text-center  rounded-full  `}
                        >
                          {question?.name.length !== 0
                            ? "View Image"
                            : "No Image"}
                        </span>
                        <span className="ml-6 font-semibold text-center rounded-full">
                          <ul className="text-left list-disc list-inside">
                            {question?.options?.map(
                              (opt: string, index: number) => (
                                <li className="text-sm" key={index}>
                                  {opt}
                                </li>
                              )
                            )}
                          </ul>
                        </span>
                        <span
                          className={`  font-semibold text-left ml-8 rounded-full  `}
                        >
                          {question?.predicted_result}
                        </span>

                        {/* <span className="flex justify-center ml-4 text-sm font-semibold ">
                          {question?.answer_description || "--"}
                        </span> */}

                        <div className="grid justify-center gap-2">
                          <button
                            className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb]"
                            onClick={() => updateHandler(question)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-rose-600 hover:bg-rose-700"
                            onClick={() => deletHandler(question?._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </section>
                    ))
                  ) : (
                    <p className="flex items-center justify-center w-full h-full font-semibold text-gray-600 font-mavenPro">
                      Add Questions
                    </p>
                  )}
                </div>
              </section>
              <Pagination
                currentPage={currentPage}
                apiData={data?.questions}
                itemsPerPage={itemsPerPage}
                handleClick={handleClick}
              />
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default TestProfile;
