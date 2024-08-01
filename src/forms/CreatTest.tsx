import React, { useEffect, useState } from "react";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { toast, ToastContainer } from "react-toastify";
import { TiArrowBackOutline } from "react-icons/ti";
import TextEditor from "../components/textEditor";
import { QuizAndTestCategoryType } from "../types";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
interface CategoryForm {
  creat: boolean;
  updateId: string;
}
interface Props {
  isTestForm: {
    creat: boolean;
    updateId: string;
  };
  setTestForm: React.Dispatch<React.SetStateAction<CategoryForm>>;
}

const CreatTest = ({ isTestForm, setTestForm }: Props) => {
  const { data, isError } = useGetDataQuery({
    url: `/test/${isTestForm?.updateId}`,
  });
  const { data:testcategory } = useGetDataQuery({
    url: "/quiztest/category",
  });
  const isUpdate = Object.keys(data || [])?.length !== 0;

  const [testDataForm, settestDataForm] = useState({
    title: data?.title ? data?.title : "",
    category: data?.category ? data?.category : "",
    instructions: data?.instructions ? data?.instructions : "",
  });

  useEffect(() => {
    if (isUpdate && !isError) {
      settestDataForm((prev) => ({
        ...prev,
        title: data?.title ? data?.title : "",
        category: data?.category ? data?.category : "",
        instructions: data?.instructions ? data?.instructions : "",
      }));
    }
  }, [isUpdate, isError, data]);

  const [isOpen, setOpen] = useState({
    category: false,
  });

  const selectOption = (field: string, value: string) => {
    console.log(value);
    settestDataForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setOpen((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const [updatePost] = useUpdatePostMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    settestDataForm((prev) => ({
      ...prev,
      [e?.target?.name]:
        e?.target?.type === "checkbox" ? e?.target?.checked : e?.target?.value,
    }));
  };
  const navigate = useNavigate();
  const submiteHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.loading("Checking Details");
    try {
      const payload = {
        title: testDataForm?.title,
        instructions: testDataForm?.instructions,
        category: testDataForm?.category
      };

      const response = await updatePost({
        data: payload,
        method: isTestForm.creat ? "POST" : "PUT",
        path: isTestForm.creat ? "/test" : `/test/${isTestForm.updateId}`,
      });
   
      if (response?.data?.success) {
        if(isTestForm.creat) navigate(`/test/${response?.data?.data?._id}`);
        toast.dismiss();
        toast.success(response?.data?.message, {
          autoClose: 5000,
        });
        closeHandler();
      } else {
        toast.dismiss();
        toast.error(
          `Failed to  ${isTestForm.creat ? "Create Test" : "Update Test"}`
        );
      }
    } catch (error) {
      toast.dismiss();
      console.error(
        `Error ${isTestForm.creat ? "Creating Test" : "Updating Test"} :`,
        error
      );
      toast.error(
        `Error ${
          isTestForm.creat ? "Creating Test" : "Updating Test"
        } : ${error}`
      );
    }
  };

  const handleEditorChange = (name: string, value: string) => {
    settestDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeHandler = () => {
    if (isTestForm.creat) {
      setTestForm((prev) => ({
        ...prev,
        creat: !prev.creat,
      }));
    } else {
      setTestForm((prev) => ({
        ...prev,
        updateId: "",
      }));
    }

    settestDataForm({
      title: "",
      category: "",
      instructions: "",
    });

  };

  

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center px-4 sm:px-0 bg-black/40"
      onClick={closeHandler}
    >
      <ToastContainer />
      <div
        className="bg-white rounded-md w-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="" onSubmit={submiteHandler}>
          {/* left section */}
          <div className="p-6 px-8 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className=" md:text-4xl text-[28px] font-bold text-gray-700 font-mavenPro">
                Test Form
              </h2>
              <button onClick={closeHandler}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 hover:text-orange-600 text-sky-600" />
              </button>
            </div>
            <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
              <div className="grid gap-2 py-4 md:gap-4 ">
                <label className="font-medium text-[18px]">Test Title:</label>
                <input
                  value={testDataForm?.title}
                  type="text"
                  onChange={handleChange}
                  name="title"
                  className={
                    " font-medium outline-none w-full  border h-10 border-gray-400 rounded-md pl-4 focus-within:border-blue-400  "
                  }
                  placeholder={"Add Title"}
                  required
                />
                {/* category of Quiz and Test */}
                <div className="relative">
                <label className="font-medium text-[18px]">Test Category:</label>
                  <div
                    className="flex justify-between p-2 pl-4 font-medium text-gray-400 border border-gray-400 rounded-md cursor-pointer focus:border-blue-200"
                    onClick={() =>
                      setOpen({ ...isOpen, category: !isOpen.category })
                    }
                  >
                    <p
                      className={`${
                        testDataForm?.category !== "" && "text-gray-800"
                      }`}
                    >
                      {testDataForm?.category !== ""
                        ? testDataForm?.category
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
                    {testcategory?.length>0?
                    testcategory?.map(
                      (caetory: QuizAndTestCategoryType, i: number) => (
                        <li
                          key={i}
                          className={`p-2 mb-2 text-sm rounded-md cursor-pointer hover:bg-blue-200/60 ${
                            testDataForm.category === caetory?.name
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
                    ):"No Category Found"}
                  </ul>
                </div>
                {/* <input
                value={testDataForm?.instructions}
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
                <label className="font-medium text-[18px]">Test Instructions! :</label>
                  <TextEditor
                    value={testDataForm?.instructions}
                    OnChangeEditor={(e: string) =>
                      handleEditorChange("instructions", e)
                    }
                  />
                </div>
               
              </div>

              <div className="flex ">
                <button
                  className="px-4 py-2 text-white bg-[#1f3c88] rounded hover:bg-[#2950b1]"
                  type="submit"
                >
                  {/* Save Changes */}
                  {isTestForm.creat ? "Submit" : "Update"}
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

export default CreatTest;
