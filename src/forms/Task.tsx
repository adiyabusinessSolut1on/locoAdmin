import React, { useEffect, useState } from "react";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { toast, ToastContainer } from "react-toastify";
import { TiArrowBackOutline } from "react-icons/ti";
import TextEditor from "../components/textEditor";
interface CategoryForm {
  content:string,
    creat:boolean,
    title:string,
    updateId:string
}
interface Props{
  isTestForm:{
    content:string,
    creat:boolean,
    title:string,
    updateId:string
  },
  setTestForm:React.Dispatch<React.SetStateAction<CategoryForm>>,
  
}

const Task = ({ isTestForm, setTestForm }:Props) => {

  const { data, isError } = useGetDataQuery({
    url: `/daily-task/${isTestForm?.updateId}`,
  });

  const isUpdate = Object.keys(data || [])?.length !== 0;
  


  const [testDataForm, settestDataForm] = useState({
    title: data?.title ? data?.title : "",
    content: data?.content ? data?.content : "",
   
  });

  useEffect(() => {
    if (isUpdate && !isError) {
      settestDataForm((prev) => ({
        ...prev,
        title: data?.title ? data?.title : "",
        content: data?.content ? data?.content : "",
 
      }));
    }
  }, [isUpdate, isError, data]);

  const [updatePost] = useUpdatePostMutation();



  const submiteHandler = async (e:React.FormEvent) => {
    e.preventDefault();

 
    toast.loading("Checking Details");
    try {
      const payload = {
        title: testDataForm?.title,
        content: testDataForm?.content,
      };
      const response = await updatePost({
        data: payload,
        method: isTestForm.creat ? "POST" : "PUT",
        path: isTestForm.creat ? "/daily-task" : `/daily-task/${isTestForm.updateId}`,
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
          `Failed to  ${isTestForm.creat ? "Create Task" : "Update Task"}`
        );
      }
    } catch (error) {
      toast.dismiss();
      console.error(
        `Error ${isTestForm.creat ? "Creating Task" : "Updating Task"} :`,
        error
      );
      toast.error(
        `Error ${
          isTestForm.creat ? "Creating Task" : "Updating Task"
        } : ${error}`
      );
    }
  };

  const handleEditorChange = (name:string, value:string) => {
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
      content: "",
   
    });
    console.log(testDataForm);
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center px-4 sm:px-0 bg-black/40"
      onClick={closeHandler}
    >
      <ToastContainer/>
      <div
        className="bg-white rounded-md w-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="" onSubmit={submiteHandler}>
          {/* left section */}
          <div className="p-6 px-8 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className=" md:text-4xl text-[28px] font-bold text-gray-700 font-mavenPro">
                Daily Task Form
              </h2>
              <button onClick={closeHandler}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 hover:text-orange-600 text-sky-600" />
              </button>
            </div>
            <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
              <div className="grid gap-2 py-4 md:gap-4 ">
                {/* <div className="w-full font-mavenPro"> */}
                <input
                  value={testDataForm?.title}
                  type="text"
                  onChange={(e) =>
                    handleEditorChange("title", e.target.value)
                  }
                  name="title"
                  className={
                    " font-medium outline-none w-full  border h-10 border-gray-400 rounded-md pl-4 focus-within:border-blue-400  "
                  }
                  placeholder={"Add Title"}
                  required
                />

                <div className="">
                  <TextEditor
                    value={testDataForm?.content}
                    OnChangeEditor={(e) =>
                      handleEditorChange("content", e)
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
                  {isTestForm?.creat ? "Submit" : "Update"}
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

export default Task;
