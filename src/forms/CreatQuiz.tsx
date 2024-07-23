import React, { useEffect, useState } from "react";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { toast } from "react-toastify";
import { TiArrowBackOutline } from "react-icons/ti";
import TextEditor from "../components/textEditor";
import { FaCaretDown } from "react-icons/fa";
import { QuizAndTestCategoryType } from "../types";
interface quizform {
  creat: boolean;
  updateId: string;
}
interface Props {
  isQuizForm: {
    creat: boolean;
    updateId: string;
  };
  setQuizForm: React.Dispatch<React.SetStateAction<quizform>>;
}
const CreatQuiz = ({ isQuizForm, setQuizForm }: Props) => {
  const { data, isError } = useGetDataQuery({
    url: `/quiz/${isQuizForm?.updateId}`,
  });

  const [isOpen, setOpen] = useState({
    category: false,
  });

  const isUpdate = Object.keys(data || [])?.length !== 0;

  const [quizDataForm, setquizDataForm] = useState({
    title: data?.title ? data?.title : "",
    category: data?.category ? data?.category : "",
    instructions: data?.instructions ? data?.instructions : "",
    completed: data?.isComplete ? data?.isComplete : false,
  });

  useEffect(() => {
    if (isUpdate && !isError) {
      setquizDataForm((prev) => ({
        ...prev,
        title: data?.title ? data?.title : "",
        category: data?.category ? data?.category : "",
        instructions: data?.instructions ? data?.instructions : "",
        completed: data?.isComplete ? data?.isComplete : false,
      }));
    }
  }, [isUpdate, isError, data]);

  const [updatePost] = useUpdatePostMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setquizDataForm((prev) => ({
      ...prev,
      [e?.target?.name]:
        e?.target?.type === "checkbox" ? e?.target?.checked : e?.target?.value,
    }));
  };

  const submiteHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(quizDataForm);
    toast.loading("Checking Details");
    try {
      const payload = {
        title: quizDataForm?.title,
        instructions: quizDataForm?.instructions,
        isComplete: quizDataForm?.completed,
      };

      const response = await updatePost({
        data: payload,
        method: isQuizForm.creat ? "POST" : "PUT",
        path: isQuizForm.creat ? "/quiz" : `/quiz/${isQuizForm.updateId}`,
      });
      console.log(response);
      if (response?.data?.success) {
        toast.dismiss();
        toast.success(response?.data?.message, {
          autoClose: 5000,
        });
        closeHandler();
      } else {
        toast.dismiss();
        toast.error(
          `Failed to  ${isQuizForm.creat ? "Create Quiz" : "Update Quiz"}`
        );
      }
    } catch (error) {
      toast.dismiss();
      console.error(
        `Error ${isQuizForm.creat ? "Creating Quiz" : "Updating Quiz"} :`,
        error
      );
      toast.error(
        `Error ${
          isQuizForm.creat ? "Creating Quiz" : "Updating Quiz"
        } : ${error}`
      );
    }
  };

  const selectOption = (field: string, value: string) => {
    console.log(value);
    setquizDataForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setOpen((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleEditorChange = (name: string, value: string) => {
    setquizDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeHandler = () => {
    if (isQuizForm.creat) {
      setQuizForm((prev) => ({
        ...prev,
        creat: !prev.creat,
      }));
    } else {
      setQuizForm((prev) => ({
        ...prev,
        updateId: "",
      }));
    }

    setquizDataForm({
      title: "",
      category: "",
      instructions: "",
      completed: false,
    });
    console.log(quizDataForm);
  };

  const categoryData = [
    {
      name: "latest",
      _id: "latest01",
    },
    {
      name: "old",
      _id: "old01",
    },
    {
      name: "newstes",
      _id: "newstes01",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center px-4 sm:px-0 bg-black/40"
      onClick={closeHandler}
    >
      <div
        className="bg-white rounded-md w-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="" onSubmit={submiteHandler}>
          {/* left section */}
          <div className="p-6 px-8 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className=" md:text-4xl text-[28px] font-bold text-gray-700 font-mavenPro">
                Quiz Form
              </h2>
              <button onClick={closeHandler}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 hover:text-orange-600 text-sky-600" />
              </button>
            </div>
            <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
              <div className="grid gap-2 py-4 md:gap-4 ">
                {/* <div className="w-full font-mavenPro"> */}
                <input
                  value={quizDataForm?.title}
                  type="text"
                  onChange={handleChange}
                  name="title"
                  className={
                    " font-medium outline-none w-full border h-10 border-gray-400 rounded-md pl-4 focus-within:border-blue-400  "
                  }
                  placeholder={"Add Title"}
                  required
                />

                {/* category of Quiz and Test */}
                <div className="relative">
                  <div
                    className="flex justify-between p-2 pl-4 font-medium text-gray-400 border border-gray-400 rounded-md cursor-pointer focus:border-blue-200"
                    onClick={() =>
                      setOpen({ ...isOpen, category: !isOpen.category })
                    }
                  >
                    <p
                      className={`${
                        quizDataForm?.category !== "" && "text-gray-800"
                      }`}
                    >
                      {quizDataForm?.category !== ""
                        ? quizDataForm?.category
                        : "Select Category"}
                    </p>
                    <FaCaretDown
                      className={`m-1 transition-all duration-300 ${
                        isOpen.category ? "rotate-180 text-blue-400" : ""
                      }`}
                    />
                  </div>
                  <ul
                    className={`mt-2 p-2 rounded-md w-32 text-white bg-gray-800 shadow-lg absolute z-10 ${
                      isOpen.category ? "max-h-60" : "hidden"
                    } custom-scrollbar`}
                  >
                    {categoryData?.map(
                      (caetory: QuizAndTestCategoryType, i: number) => (
                        <li
                          key={i}
                          className={`p-2 mb-2 text-sm rounded-md cursor-pointer hover:bg-blue-200/60 ${
                            quizDataForm.category === caetory?.name
                              ? "bg-rose-400"
                              : ""
                          }`}
                          onClick={() =>
                            selectOption("category", caetory?.name)
                          }
                        >
                          <span>{caetory?.name}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                {/* <input
                value={quizDataForm?.instructions}
                type="text"
                onChange={handleChange}
                name="instructions"
                className={
                  " font-medium outline-none w-full  border h-10 border-gray-400 rounded-md pl-4 focus-within:border-blue-400  "
                }
                placeholder={"Add Instruction here"}
                required
              /> */}
                <div className="">
                  <TextEditor
                    value={quizDataForm?.instructions}
                    OnChangeEditor={(e: string) =>
                      handleEditorChange("instructions", e)
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={quizDataForm.completed}
                    onChange={handleChange}
                    name="completed"
                    className={
                      " font-medium outline-none   border border-gray-400 rounded-md pl-4 focus-within:border-blue-400  "
                    }
                    required
                  />
                  <span
                    className={`text-sm font-semibold ${
                      quizDataForm.completed ? "text-black" : "text-gray-500"
                    } `}
                  >
                    Completed
                  </span>
                </div>
              </div>

              <div className="flex ">
                <button
                  className="px-4 py-2 text-white bg-[#1f3c88] rounded hover:bg-[#2950b1]"
                  type="submit"
                >
                  {/* Save Changes */}
                  {isQuizForm.creat ? "Submit" : "Update"}
                </button>
                <button
                  className="px-4 py-2 ml-8 text-white bg-red-500 rounded hover:bg-red-400"
                  onClick={closeHandler}
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

export default CreatQuiz;
