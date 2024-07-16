import React, { useEffect, useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { toast, ToastContainer } from "react-toastify";
import TextEditor from "../components/textEditor";
import { FaCaretDown } from "react-icons/fa";

interface QuestionData {
  _id: string;
  name: string;
  options: string[];
  predicted_result: string;
  answer_description: string;
}

interface quitst {
  condition: boolean;
  isCreat: boolean;
  data: QuestionData;
  quizId: string;
}

interface Props {
  close: () => void;
  isQuestionForm: quitst;
}

interface StateProps {
  question: string;
  options: string[];
  result: string;
  content: string;
}

const QuizQuestion: React.FC<Props> = ({ isQuestionForm, close }: Props) => {
  const [updatePost] = useUpdatePostMutation();

  const [quizData, setQuizData] = useState<StateProps>({
    question: isQuestionForm?.data?.name || "",
    options: isQuestionForm?.data?.options || [],
    result: isQuestionForm?.data?.predicted_result || "",
    content: isQuestionForm?.data?.answer_description || "",
  });

  const { data, isError } = useGetDataQuery({
    url: `/quiz/question/${isQuestionForm?.data?._id}`,
  });

  const isUpdate = !!data;

  useEffect(() => {
    if (isUpdate && !isError) {
      setQuizData({
        question: data?.name || "",
        options: data?.options || [],
        result: data?.predicted_result || "",
        content: data?.answer_description || "",
      });
    }
  }, [isUpdate, isError, data]);

  const [isOpen, setOpen] = useState({
    result: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setQuizData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const quizQuestionObject = {
      name: quizData.question,
      options: quizData.options,
      predicted_result: quizData.result,
      answer_description: quizData.content,
    };

    toast.loading("Checking Details");
    try {
      const response = await updatePost({
        data: quizQuestionObject,
        method: isQuestionForm.isCreat ? "POST" : "PUT",
        path: isQuestionForm.isCreat
          ? `/quiz/question/${isQuestionForm.quizId}`
          : `/quiz/question/${data?._id}`,
      });
      if (response?.data?.success) {
        toast.dismiss();
        toast.success(response?.data?.message, {
          autoClose: 5000,
        });
        clearHandler();
      } else {
        toast.dismiss();
        toast.error(
          `Failed to ${
            isQuestionForm.isCreat
              ? "Create Quiz Question"
              : "Update Quiz Question"
          }`
        );
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error creating Quiz Question:", error);
      toast.error(
        `Error ${
          isQuestionForm.isCreat
            ? "Creating Quiz Question"
            : "Updating Quiz Question"
        } : ${error}`
      );
    }
  };

  const handleEditorChange = (name: string, value: string) => {
    setQuizData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectOption = (field: string, value: string) => {
    setQuizData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setOpen((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleQuestionInput = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newOption = e.currentTarget.value.trim();
      if (newOption && !quizData.options.includes(newOption)) {
        setQuizData((prev) => ({
          ...prev,
          options: [...prev.options, newOption],
        }));
      }
      e.currentTarget.value = "";
    }
  };

  const handleQuestionRemove = (optionToRemove: string) => {
    setQuizData((prev) => ({
      ...prev,
      options: prev.options.filter((option) => option !== optionToRemove),
    }));
  };

  const clearHandler = () => {
    setQuizData({
      question: "",
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
      <ToastContainer />
      <div className="md:w-[800px] bg-white rounded-md">
        <form
          className="w-full h-full overflow-hidden rounded-md"
          onSubmit={submitHandler}
        >
          <div className="flex-1 h-full p-6 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className="md:text-4xl text-[28px] font-bold text-gray-500 font-mavenPro">
                Quiz Question Form
              </h2>
              <div onClick={close}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" />
              </div>
            </div>
            <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto font-mavenPro">
              <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
                <input
                  value={quizData.question}
                  type="text"
                  onChange={handleChange}
                  name="question"
                  className="w-full h-10 col-span-1 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none md:col-span-2 focus:border-blue-200"
                  placeholder="Write Question"
                  required
                />

                <div className="grid grid-cols-2 col-span-2 gap-4">
                  <input
                    type="text"
                    onKeyDown={handleQuestionInput}
                    className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200"
                    placeholder="Add Options (press Enter or comma to add)"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {quizData.options.map((tag, index) => (
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
                    {quizData.result !== ""
                      ? quizData.result
                      : "Select Result"}
                    <FaCaretDown className="m-1" />
                  </div>
                  <ul
                    className={`mt-2 p-2 rounded-md w-64 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${
                      isOpen.result ? "max-h-60" : "hidden"
                    } custom-scrollbar`}
                  >
                    {quizData?.options?.length !== 0 ? (
                      quizData?.options?.map((option, i) => (
                        <li
                          key={i}
                          className={`p-2 mb-2 text-sm text-[#DEE1E2]  rounded-md cursor-pointer hover:bg-blue-200/60 ${
                            quizData.result === option ? "bg-rose-600" : ""
                          }`}
                          onClick={() => selectOption("result", option)}
                        >
                          <span>{option}</span>
                        </li>
                      ))
                    ) : (
                      <p>Please Create Option</p>
                    )}
                  </ul>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <TextEditor
                    value={quizData.content}
                    OnChangeEditor={(e) =>
                      handleEditorChange("content", e)
                    }
                  />
                </div>
              </div>

              <div className="flex">
                <button
                  className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb]"
                  type="submit"
                >
                  {isUpdate ? "Update" : "Submit"}
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

export default QuizQuestion;
