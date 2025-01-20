import React, { useEffect, useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { toast, ToastContainer } from "react-toastify";
import TextEditor from "../components/textEditor";
import { FaCaretDown } from "react-icons/fa";
import { TestQuestionsType } from "../types";
// import uploadImage from "../firebase_image/image";
import DeleteICONSVG from "../assets/SVG/deleteICON";

interface Props {
  close: () => void,
  isQuestionForm: {
    condition: boolean,
    isCreat: boolean,
    data: TestQuestionsType,
    testId: string
  },

}
/* interface StateProps {
  name: string
  image: string[];
  imageSrc: File[];
  options: string[];
  result: string;
  content: string;
} */

const TestQuestion = ({ isQuestionForm, close }: Props) => {

  const [updatePost] = useUpdatePostMutation();


  const [testData, settestData] = useState<any>({
    name: isQuestionForm?.data?.name,
    image: isQuestionForm?.data?.image || [],
    imageSrc: [],
    options: isQuestionForm?.data?.options || [],
    result: isQuestionForm?.data?.predicted_result || "",
    content: isQuestionForm?.data?.answer_description || "",
  });




  const { data, isError } = useGetDataQuery({
    url: `/test/question/${isQuestionForm?.data?._id}`,
  });
  const isUpdate = Object.keys(data || [])?.length !== 0;


  useEffect(() => {
    console.log("i am working");
    if (isUpdate && !isError) {
      settestData((prev: any) => ({
        ...prev,
        name: data?.name || "",
        image: data?.image || [],
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

    if (!testData?.name) {
      toast.error("Please enter a question name");
      return;
    }

    if (!testData?.options.length) {
      toast.error("Please add at least two options");
      return;
    }
    if (!testData?.image) {
      toast.error("Please add at least one image");
      return;
    }
    if (!testData?.result) {
      toast.error("Please select a predicted option");
      return;
    }


    // const testQuestionObject = {
    //   name: testData?.name,
    //   image: testData?.image,
    //   options: testData?.options,
    //   predicted_result: testData?.result,
    //   answer_description: testData?.content,
    // };

    // console.log("testQuestionObject: ", testQuestionObject);

    // toast.loading("Checking Details");
    try {


      /* const response = await updatePost({
        data: testQuestionObject,
        method: isQuestionForm.isCreat ? "POST" : "PUT",
        path: isQuestionForm.isCreat ? `/test/question/${isQuestionForm?.testId}` : `/test/question/${isQuestionForm?.data?._id}`,
      }) */

      // console.log(response);
      /*  if (response?.data?.success) {
         toast.dismiss();
         // toast.success(response?.data?.message, { autoClose: 5000, });
         toast.success("response?.data?.message", { autoClose: 5000, });
         clearHandler();
       } else {
         toast.dismiss();
         toast.error(`Failed to  ${isQuestionForm.isCreat ? "Create Test Question" : "Update Test Question"}`);
       } */
      const formData = new FormData()
      formData.append("name", testData.name)
      formData.append("image", testData.image)
      testData?.options.length > 0 && testData?.options?.map((val: any) => {
        formData.append("options", val)
      })
      // formData.append("options", testData.options)
      formData.append("predicted_result", testData.result)
      formData.append("answer_description", testData.content)

      console.log("formData: ", formData);
      const response = await updatePost({
        data: formData,
        method: isQuestionForm.isCreat ? "POST" : "PUT",
        path: isQuestionForm.isCreat ? `/test/question/${isQuestionForm?.testId}` : `/test/question/${isQuestionForm?.data?._id}`,
      }).unwrap()

      // console.log(response);
      if (response?.success) {
        toast.dismiss();
        toast.success(response?.message, { autoClose: 5000, });
        clearHandler();
      } else {
        toast.dismiss();
        toast.error(`Failed to  ${isQuestionForm.isCreat ? "Create Test Question" : "Update Test Question"}`);
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error creating Test Question:", error);
      toast.error(`Error ${isQuestionForm.isCreat ? "Creating Test Question" : "Updating Test Question"} : ${error}`);
    }
  };

  const handleEditorChange = (name: string, value: string) => {
    settestData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectOption = (field: string, value: string) => {
    console.log(value);
    settestData((prev: any) => ({
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
        settestData((prev: any) => ({
          ...prev,
          options: [...prev.options, newOption],
        }));
      }
      e.currentTarget.value = "";
    }
  };

  const handleQuestionRemove = (optionToRemove: string) => {
    settestData((prev: any) => ({
      ...prev,
      options: prev.options.filter((option: any) => option !== optionToRemove),
    }));
  };

  const clearHandler = () => {
    settestData({
      name: "",
      image: [],
      imageSrc: [],
      options: [],
      result: "",
      content: "",
    });
    close();
  };

  // const [progressStatus, setProgressStatus] = useState<number | null>(null);

  const handleDeleteImage = (index: number) => {
    settestData((prevState: any) => ({
      ...prevState,
      image: prevState?.image.filter((_: any, i: any) => i !== index),
    }));
  };
  /* const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      settestData({ ...testData, image: selectedFile, imageSrc: selectedFile?.name });
    }
  }; */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // Use optional chaining to handle null
    if (selectedFile) {
      settestData({
        ...testData,
        image: selectedFile,
        imageSrc: selectedFile.name
      });
    }
  };


  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center px-4 sm:px-0 bg-black/40" onClick={close}>
      <ToastContainer />
      <div className="md:w-[800px] bg-white rounded-md " onClick={(e) => e.stopPropagation()}>
        <form className="w-full h-full overflow-hidden rounded-md " onSubmit={submitHandler}>
          <div className="flex-1 h-full p-6 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className="md:text-4xl text-[28px] font-bold text-gray-500 font-mavenPro">Test Question Form</h2>
              <div onClick={close}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" />
              </div>
            </div>

            <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
              <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
                <label className="font-medium">Question Name:</label>
                <div className="grid grid-cols-1 col-span-1 gap-2 md:gap-4 md:grid-cols-2 md:col-span-2">

                  <input type="text" value={testData?.name} onChange={(e) => handleEditorChange("name", e.target.value)} className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200" placeholder="Add Options (press Enter or comma to add)" />
                </div>

                <label className="font-medium">Question Images:</label>
                <div className="relative grid items-center w-full h-full grid-cols-1 col-span-1 gap-2 md:gap-4 md:col-span-2 md:grid-cols-2">
                  <input type="file" accept="image/*" name="image" onChange={handleImageChange} className={`px-2 py-[5px] w-full text-sm border border-gray-400 focus-within:border-sky-400 rounded-md placeholder:text-gray-500 outline-none`} placeholder="Image URL" />
                  {/* {progressStatus !== null && (
                    <div className="absolute inset-0 z-10 flex items-end">
                      <div className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]" style={{ width: `${progressStatus}%` }}></div>
                    </div>
                  )} */}

                </div>
                <div className="grid grid-cols-1 col-span-1 gap-2 md:gap-4 md:grid-cols-2 md:col-span-2">
                  {Array.isArray(testData?.image) ? (
                    testData.image.length > 0 && (
                      <ul className="flex flex-wrap gap-5 items-end">
                        {testData.image.map((item: string, index: number) => (
                          <div key={index} className="flex flex-col gap-3">
                            <img src={item} className="max-h-20 max-w-[7rem]" alt={`Uploaded ${index}`} />
                            <i
                              className="text-red-600 flex items-center justify-center cursor-pointer"
                              onClick={() => handleDeleteImage(index)}
                            >
                              <DeleteICONSVG height={20} width={20} fill={"#ce3939"} />
                            </i>
                          </div>
                        ))}
                      </ul>
                    )
                  ) : (
                    testData?.image && (
                      <ul className="flex flex-wrap gap-5 items-end">
                        <div className="flex flex-col gap-3">
                          <img src={testData.image} className="max-h-20 max-w-[7rem]" alt="Uploaded" />
                        </div>
                      </ul>
                    )
                  )}
                </div>

                {/* Add Option */}
                <label className="font-medium">Enter Options:</label>

                <div className="grid grid-cols-1 col-span-1 gap-2 md:gap-4 md:grid-cols-2 md:col-span-2">
                  <input type="text" onKeyDown={handleQuestionInput} className="w-full h-10 pl-4 font-medium bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200" placeholder="Add Options (press Enter or comma to add)" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {testData?.options.map((tag: any, index: any) => (
                      <span key={index} className="flex items-center px-2 py-1 text-sm font-medium text-white bg-green-600 rounded-full">
                        {tag}
                        <button type="button" className="ml-2 text-xs font-bold" onClick={() => handleQuestionRemove(tag)}>x</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <label className="font-medium">Select predicted option:</label>
                  <div className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-green-100 border-transparent rounded-md cursor-pointer focus:border-blue-200" onClick={() => setOpen({ ...isOpen, result: !isOpen.result })}>
                    {testData.result !== "" ? testData.result : "Select Result"}
                    <FaCaretDown className="m-1" />
                  </div>

                  <ul className={`mt-2 p-2 rounded-md w-64 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${isOpen.result ? "max-h-60" : "hidden"} custom-scrollbar`}>
                    {testData.options.length !== 0 ? (
                      testData.options?.map((option: any, i: any) => (
                        <li key={i} className={`p-2 mb-2 text-sm text-[#DEE1E2]  rounded-md cursor-pointer hover:bg-blue-200/60 ${testData.result === option ? "bg-rose-600" : ""}`} onClick={() => selectOption("result", option)}>
                          <span>{option}</span>
                        </li>
                      ))
                    ) : (
                      <p>Please Creat Option</p>
                    )}
                  </ul>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <TextEditor value={testData?.content} OnChangeEditor={(e) => handleEditorChange("content", e)} />
                </div>
              </div>

              <div className="flex">
                <button className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb] " type="submit" >{isUpdate && !isError ? "Update" : "Submit"}</button>
                <button className="px-4 py-2 ml-8 text-white rounded-md bg-rose-600 hover:bg-rose-700" type="button" onClick={close}>Cancel</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestQuestion;
