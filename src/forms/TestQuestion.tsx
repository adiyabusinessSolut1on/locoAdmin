import React, { useEffect, useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { toast, ToastContainer } from "react-toastify";
import TextEditor from "../components/textEditor";
import { FaCaretDown } from "react-icons/fa";
import MultipleImageUploadeForm from "../components/multiple_image_upload/MultipleImageUploadeForm";
import { TestQuestionsType } from "../types";

interface Props{
  close:()=>void,
  isQuestionForm:{
    condition: boolean,
    isCreat: boolean,
    data: TestQuestionsType,
    testId: string
  },
 
}
interface StateProps {
  image: string[];
  imageSrc: File[];
  options: string[];
  result: string;
  content: string;
}

const TestQuestion = ({ isQuestionForm, close }:Props) => {

  const [updatePost] = useUpdatePostMutation();

  const [testData, settestData] = useState<StateProps>({
    image: isQuestionForm?.data?.name || [],
    imageSrc: [],
    options: isQuestionForm?.data?.options || [],
    result: isQuestionForm?.data?.predicted_result || "",
    content: isQuestionForm?.data?.answer_description || "",
  });
  

  // useState(() => {
  //   settestData({
  //     image: isQuestionForm?.data?.name || [],
  //     imageSrc: [],
  //     options: isQuestionForm?.data?.options || [],
  //     result: isQuestionForm?.data?.predicted_result || "",
  //     content: isQuestionForm?.data?.answer_description || "",
  //   });
  // }, []);

  console.log(testData);

  const { data,  isError } = useGetDataQuery({
    url: `/test/question/${isQuestionForm?.data?._id}`,
  });
  const isUpdate = Object.keys(data || [])?.length !== 0;
  console.log(
    data,
    isUpdate,
    isError,
    isQuestionForm,
    close,
    "from creat form",
    isQuestionForm.isCreat ? "POST" : "PUT"
  );

  useEffect(() => {
    console.log("i am working");
    if (isUpdate && !isError) {
      settestData((prev) => ({
        ...prev,
        image: data?.name || "",
        options: data?.options || [],
        result: data?.predicted_result || "",
        content: data?.answer_description || "",
      }));
    }
  }, [isUpdate, isError, data]);

  const [isOpen, setOpen] = useState({
    result: false,
  });



  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const testQuestionObject = {
      name: testData?.image,

      options: testData?.options,
      predicted_result: testData?.result,
      answer_description: testData?.content,
    };

    console.log(testQuestionObject);

    toast.loading("Checking Details");
    try {
      const response = await updatePost({
        data: testQuestionObject,
        method: isQuestionForm.isCreat ? "POST" : "PUT",
        path: isQuestionForm.isCreat
          ? `/test/question/${isQuestionForm?.testId}`
          : `/test/question/${isQuestionForm?.data?._id}`,
      });
      console.log(response);
      if (response?.data?.success) {
        toast.dismiss();
        toast.success(response?.data?.message, {
          autoClose: 5000,
        });
        clearHandler();
      } else {
        toast.dismiss();
        toast.error(
          `Failed to  ${
            isQuestionForm.isCreat
              ? "Create Test Question"
              : "Update Test Question"
          }`
        );
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error creating Test Question:", error);
      toast.error(
        `Error ${
          isQuestionForm.isCreat
            ? "Creating Test Question"
            : "Updating Test Question"
        } : ${error}`
      );
    }
  };

  const handleEditorChange = (name:string, value:string) => {
    settestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectOption = (field: string, value: string) => {
    console.log(value);
    settestData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setOpen((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleQuestionInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newOption = e.currentTarget.value.trim();
      if (newOption && !testData.options.includes(newOption)) {
        settestData((prev) => ({
          ...prev,
          options: [...prev.options, newOption],
        }));
      }
      e.currentTarget.value = "";
    }
  };

  const handleQuestionRemove = (optionToRemove: string) => {
    settestData((prev) => ({
      ...prev,
      options: prev.options.filter((option) => option !== optionToRemove),
    }));
  };

  const clearHandler = () => {
    settestData({
      image: [],
      imageSrc: [],
      options: [],
      result: "",
      content: "",
    });
    close();
  };
  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center px-4 sm:px-0 bg-black/40"
      onClick={close}
    >
      <ToastContainer/>
      <div
        className="md:w-[800px] bg-white rounded-md "
        // className="w-full bg-white md:px-4 md:ml-4 md:pl-0"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          className="w-full h-full overflow-hidden rounded-md "
          onSubmit={submitHandler}
        >
          <div className="flex-1 h-full p-6 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className="md:text-4xl text-[28px] font-bold text-gray-500 font-mavenPro">
                Test Question Form
              </h2>
              <div onClick={close}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" />
              </div>
            </div>
            <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
              <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
                <MultipleImageUploadeForm
                  imge={testData.image}
                  setImageData={settestData}
                />

                {/* Add Option */}
                <div className="grid grid-cols-1 col-span-1 gap-2 md:gap-4 md:grid-cols-2 md:col-span-2">
                  <input
                    type="text"
                    // value={}
                    onKeyDown={handleQuestionInput}
                    className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200"
                    placeholder="Add Options (press Enter or comma to add)"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {testData.options.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center px-2 py-1 text-sm font-medium text-white bg-green-600 rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-2 text-xs font-bold"
                          onClick={() => handleQuestionRemove(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

         
                <div className="relative">
                  <div
                    className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-green-100 border-transparent rounded-md cursor-pointer focus:border-blue-200"
                    onClick={() =>
                      setOpen({ ...isOpen, result: !isOpen.result })
                    }
                  >
                    {testData.result !== "" ? testData.result : "Select Result"}
                    <FaCaretDown className="m-1" />
                  </div>
                  <ul
                    className={`mt-2 p-2 rounded-md w-64 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${
                      isOpen.result ? "max-h-60" : "hidden"
                    } custom-scrollbar`}
                  >
                    {testData.options.length !== 0 ? (
                      testData.options?.map((option, i) => (
                        <li
                          key={i}
                          className={`p-2 mb-2 text-sm text-[#DEE1E2]  rounded-md cursor-pointer hover:bg-blue-200/60 ${
                            testData.result === option ? "bg-rose-600" : ""
                          }`}
                          onClick={() => selectOption("result", option)}
                        >
                          <span>{option}</span>
                        </li>
                      ))
                    ) : (
                      <p>Please Creat Option</p>
                    )}
                  </ul>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <TextEditor
                    value={testData?.content}
                    OnChangeEditor={(e) => handleEditorChange("content", e)}
                  />
                </div>
              </div>

              <div className="flex">
                <button
                  className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb] "
                  type="submit"
                  // disabled={isError}
                >
                  {isUpdate && !isError ? "Update" : "Submit"}
                </button>
                <button
                  className="px-4 py-2 ml-8 text-white rounded-md bg-rose-600 hover:bg-rose-700"
                  type="button"
                  onClick={close}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestQuestion;
