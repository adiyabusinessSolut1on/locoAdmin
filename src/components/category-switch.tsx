import React, { useState } from "react";
import {
  useCreatePostMutation,
  useGetDataQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteICONSVG from "../assets/SVG/deleteICON";
import EditICONSVG from "../assets/SVG/editICON";
import { BlogCategory, subSubCategories, subcategory } from "../types";
import Loader from "./loader";
import uploadImage from "../firebase_image/image";

interface Props {
  value: string;
}



const Switches = ({ value }: Props) => {
  const route = React.useMemo(() => {
    switch (value) {
      case "tab1":
        return <Tab1 />;
      case "tab2":
        return <Tab2 />;
      case "tab3":
        return <Tab3 />;
      case "tab4":
        return <Tab4 />;
    }
  }, [value]);
  return route;
};
export default Switches;

const Tab1: React.FC = () => {
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data, refetch, isLoading } = useGetDataQuery({
    url: "/get-blog-category",
  });

  console.log(data, "main category");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState({
editname:"",
editimage:""
  });
  const [createData, setCreateData] = useState({
    name:"",
    image:""
  });

  const handleEditClick = (id: string, name: string, image: string) => {
   
    setEditingId(id);
    setEditing({
      editname:name,
      editimage:image
    })
  };
 


  const handleSaveClick = async () => {
    try {
      const response = await updatePost({
        path: `/main-category/${editingId}`,
        data: { name: editing?.editname, image: editing?.editimage },
      });
      if (response?.data?.success) {
        toast.success(response?.data?.message, {
          autoClose: 5000,
        });
        refetch();
        setEditingId(null);
        setEditing({
          editname:"",
          editimage:""
        });
      } else {
        toast.error("Failed to Update main category");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditing({
      editname:"",
      editimage:""
    });
  };

  const [progressStatus, setProgressStatus] = useState<number | null>(null);
  const [progressStatus1, setProgressStatus1] = useState<number | null>(null);
 
  const handleImageCreate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle Image in Create")
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      try {
        const imageUrl = await uploadImage(
          selectedFile.name,
          selectedFile,
          setProgressStatus
        );
        setCreateData({
          ...createData,
          image: imageUrl,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };
   const handleImageEdit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle Image in Edit")
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      try {
        const imageUrl = await uploadImage(
          selectedFile.name,
          selectedFile,
          setProgressStatus1
        );
        setEditing({
          ...editing,
          editimage: imageUrl,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };
  const handleClickCreate = async () => {
    try {
      const response = await createPost({
        data: { name: createData?.name, image: createData.image },
        path: "main-category",
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message, {
          autoClose: 5000,
        });
        refetch();
        setCreateData({
          name:"",
          image:""
        });
      } else {
        toast.error("Failed to create main category");
      }
    } catch (error) {
      console.error("Error creating main category:", error);
      toast.error("An error occurred");
    }
  };

  const handleShowAlert = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to continue?");
    if (confirmed) {
      try {
        const response = await deletePost({ url: `/main-category/${id}` });
        if (response.data.success) {
          toast.success(response?.data?.message, {
            autoClose: 5000,
          });
          refetch();
        } else {
          toast.error("Failed to delete category");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="md:flex flex-row w-full h-[400px] gap-2">
        {isLoading && <Loader />}
        <div className="flex flex-col w-full gap-5 p-10 border-b-2 border-gray-200 md:border-b-0 md:border-r-2">
          <h3 className="text-[18px] font-[600] text-center">
            Create Main Category
          </h3>
          <div className="grid gap-3">
            <label className="text-gray-600 font-bold text-[15px]">
              Main Category
            </label>
            <input
              value={createData?.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCreateData((prev)=>({...prev,name:e.target.value}))
              }
              // className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
              className="w-full h-8 pl-2 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none placeholder:pl-2 focus:border-blue-200 "
              type="text"
              placeholder="Enter Title"
            />
            <div className="flex flex-row gap-4">
              {createData?.image&&<img src={createData?.image} alt="main Image" className="h-20 w-20"/>}
            <div className="relative w-full h-full">
              <input
                type="file"
                name="image"
                onChange={handleImageCreate}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`px-4 py-1 pl-24 relative ${
                  progressStatus ? "pb-1" : ""
                } w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}
              >
                <p
                  className={`${
                    createData.image ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  { "Choose a file"}
                </p>
                <span className="text-gray-400 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-blue-200">
                  Browse
                </span>
              </label>
              {progressStatus !== null && progressStatus !== 0 && (
                <>
                  <div className="absolute inset-0 z-10 flex items-end">
                    <div
                      className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"
                      style={{ width: `${progressStatus}%` }}
                      // style={{ width: `${100}%` }}
                    ></div>
                  </div>
                </>
              )}
            </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleClickCreate}
              disabled={!createData}
              className={`${
                createData ? "bg-[#1e40af]" : "bg-gray-500"
              } px-4 py-2 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
            >
              Save
            </button>
          </div>
        </div>

        <div className="w-full   max-h-[400px] p-4 overflow-auto ">
          <ul className="p-2 list-disc">
            {Array.isArray(data?.data) ? (
              data?.data?.map((item: BlogCategory, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between gap-3 py-2 mb-2 font-medium text-gray-600 "
                >
                  {editingId === item._id ? (
                    <div className="grid w-full gap-2">
                      <input
                        type="text"
                        value={editing?.editname}
                        onChange={(e) => setEditing((prev)=>({...prev, editname:e.target.value}))}
                        className="w-full h-8 pl-2 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                      />
                      <div className="flex flex-row gap-3">
                        {editing?.editimage&&<img src={editing?.editimage} className="h-10 w-10" alt="imageg"/>}
                      <div className="relative w-full h-full">
                        <input
                          type="file"
                          name="image"
                          onChange={handleImageEdit}
                          className="hidden"
                          id="Image-upload"
                        />
                        <label
                          htmlFor="Image-upload"
                          className={`px-4 py-1 pl-24 relative ${
                            progressStatus1 ? "pb-1" : ""
                          } w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}
                        >
                          <p
                            className={`${
                              editing?.editimage
                                ? "text-gray-700"
                                : "text-gray-400"
                            }`}
                          >
                            { "Choose a file"}
                          </p>
                          <span className="text-gray-400 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-blue-200">
                            Browse
                          </span>
                        </label>
                        {progressStatus1 !== null && progressStatus1 !== 0 && (
                          <>
                            <div className="absolute inset-0 z-10 flex items-end">
                              <div
                                className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"
                                style={{ width: `${progressStatus1}%` }}
                                // style={{ width: `${100}%` }}
                              ></div>
                            </div>
                          </>
                        )}
                      </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveClick}
                          className="px-3 py-1 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        {/* <span className="text-lg font-medium text-gray-600"> */}

                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="object-contain w-10 h-10"
                          />
                        ) : (
                          <span className="text-xs font-bold text-gray-400 rounded-md bg-gray-50">
                            No Icon
                          </span>
                        )}
                        {/* </span> */}
                        <span className="text-lg font-medium text-gray-600">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex flex-row gap-5">
                        <button onClick={() => handleShowAlert(item?._id)}>
                          <DeleteICONSVG
                            height={20}
                            width={20}
                            fill={"#fe2828"}
                          />
                        </button>
                        <button
                          onClick={() =>
                            handleEditClick(item?._id, item?.name, item?.image)
                          }
                        >
                          <EditICONSVG
                            height={20}
                            width={20}
                            fill={"#5b5a5a"}
                          />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))
            ) : (
              <p>No data available</p>
            )}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

const Tab2: React.FC = () => {
  interface StateProp {
    mainId: string;
    name: string;
  }
  interface editprops {
    mainId: string;
    subId: string;
    name: string;
  }
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data, refetch, isLoading } = useGetDataQuery({
    url: "/get-blog-category",
  });
  const [editId, setEditId] = useState<editprops>({
    mainId: "",
    subId: "",
    name: "",
  });
  interface ShowSubCategories {
    [key: string]: boolean;
  }
  const [showSubCategories, setShowSubCategories] = useState<ShowSubCategories>(
    {}
  );
  const [createSubCategory, setSubCategory] = useState<StateProp>({
    mainId: "",
    name: "",
  });
  const handleChangesValue = (name: string, value: string) => {
    setSubCategory((prev) => ({ ...prev, [name]: value }));
  };
  const HanldeCreate = async () => {
    try {
      const response = await createPost({
        data: { name: createSubCategory?.name },
        path: `/sub-category/${createSubCategory?.mainId}`,
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message, {
          autoClose: 3000,
        });
        refetch();
        setSubCategory((prev) => ({ ...prev, name: "" }));
      } else {
        toast.error("Failed to create Sub category");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };
  const handleEditClick = (mainId: string, subId: string, name: string) => {
    setEditId({ mainId, subId, name });
  };

  const handleSaveClick = async () => {
    try {
      const response = await updatePost({
        path: `/sub-category/${editId?.mainId}/${editId?.subId}`,
        data: { name: editId?.name },
      });
      if (response?.data?.success) {
        toast.success(response?.data?.message, {
          autoClose: 5000,
        });
        refetch();
        setEditId({ mainId: "", subId: "", name: "" });
      } else {
        toast.error("Failed to Update main category");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  const handleCancelClick = () => {
    setEditId({ mainId: "", subId: "", name: "" });
  };

  const toggleSubCategories = (categoryId: string) => {
    setShowSubCategories((prevState: ShowSubCategories) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };
  const handleDelete = async (mainId: string, subId: string) => {
    const confirmed = window.confirm("Are you sure you want to continue?");
    if (confirmed) {
      try {
        const response = await deletePost({
          url: `/sub-category/${mainId}/${subId}`,
        });
        if (response.data.success) {
          toast.success(response?.data?.message, {
            autoClose: 3000,
          });
          refetch();
        } else {
          toast.error("Failed to delete category");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <div className="md:flex flex-row w-full h-[400px] gap-2">
      {isLoading && <Loader />}
      <ToastContainer />
      <div className="flex flex-col w-full gap-5 p-10 border-b-2 border-gray-200 md:border-b-0 md:border-r-2">
        <h3 className=" text-[18px] font-bold text-gray-600">
          Create Sub-Category
        </h3>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-bold text-[15px] ">
            Main Category
          </label>
          <select
            // className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
            className="w-full h-8 pl-2 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200"
            value={createSubCategory?.mainId}
            onChange={(e) => handleChangesValue("mainId", e.target.value)}
          >
            <option value="">Select</option>
            {data?.data?.map((category: BlogCategory, index: number) => {
              return (
                <option key={index} value={category?._id}>
                  {category?.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-bold text-[15px] ">
            Sub-Category
          </label>
          <input
            value={createSubCategory?.name}
            onChange={(e) => handleChangesValue("name", e.target.value)}
            // className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
            className="w-full h-8 pl-4 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200"
            type="text"
            placeholder="Enter Title"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={HanldeCreate}
            disabled={!createSubCategory?.name && !createSubCategory?.mainId}
            className={` ${
              createSubCategory?.name && createSubCategory?.mainId
                ? "bg-[#1e40af]"
                : // ? "bg-[#5a83bd]"
                  "bg-gray-500"
            } px-4 py-2 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
          >
            Save
          </button>
        </div>
      </div>
      <div className=" w-full mt-1 max-h-[400px] p-4 overflow-auto ">
        <ul className="w-full list-none ">
          {data?.data?.map((category: BlogCategory, index: number) => (
            <div key={index} className="mb-4 bg-[#f8f8f8] p-1 rounded-[7px]">
              <div className="flex items-center justify-between ">
                <h2 className="text-lg font-bold text-gray-600 ">
                  {category?.name}
                </h2>
                {category?.subCategories?.length > 0 && (
                  <button onClick={() => toggleSubCategories(category?._id)}>
                    {/* {showSubCategories[category?._id] ? ( */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 transition-all duration-500 ${
                        showSubCategories[category?._id] ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {showSubCategories[category?._id] && (
                <ul className="pl-6 mt-2 list-disc">
                  {category?.subCategories?.map((sub) => (
                    <li
                      key={sub?._id}
                      className="flex flex-row justify-between mb-2"
                    >
                      {editId?.subId === sub?._id ? (
                        <div className="grid w-full gap-2">
                          <input
                            type="text"
                            value={editId?.name}
                            onChange={(e) =>
                              setEditId((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="px-2 py-1 border rounded-md"
                          />
                          <div className="flex justify-end">
                            <button
                              disabled={
                                !editId?.mainId &&
                                !editId?.subId &&
                                !editId?.name
                              }
                              onClick={handleSaveClick}
                              className="px-3 py-1 ml-2 text-white bg-green-500 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelClick}
                              className="px-3 py-1 ml-2 text-white bg-red-500 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="mr-2 text-base font-medium text-gray-600 list-disc">
                            {sub?.name}
                          </span>
                          <div className="flex flex-row gap-5">
                            <button
                              onClick={() =>
                                handleDelete(category?._id, sub?._id)
                              }
                            >
                              <DeleteICONSVG
                                height={20}
                                width={20}
                                fill={"#fe2828"}
                              />
                            </button>
                            <button
                              onClick={() =>
                                handleEditClick(
                                  category?._id,
                                  sub?._id,
                                  sub?.name
                                )
                              }
                            >
                              <EditICONSVG
                                height={20}
                                width={20}
                                fill={"#5b5a5a"}
                              />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};
const Tab3: React.FC = () => {
  interface StateProp {
    mainId: string;
    subId: string;
    name: string;
  }
  interface EditProps {
    mainId: string;
    subId: string;
    subSubId: string;
    name: string;
  }

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data, refetch, isLoading } = useGetDataQuery({
    url: "/get-blog-category",
  });

  const [subData, setSubData] = useState<BlogCategory[]>([]);
  const [createSubCategory, setCreateSubCategory] = useState<StateProp>({
    mainId: "",
    subId: "",
    name: "",
  });

  const [showSubCategories, setShowSubCategories] = useState<
    Record<string, boolean>
  >({});
  const [showSubSubCategories, setShowSubSubCategories] = useState<
    Record<string, boolean>
  >({});
  const [editData, setEditData] = useState<EditProps>({
    mainId: "",
    subId: "",
    subSubId: "",
    name: "",
  });

  const handleChangesValue = (name: string, value: string) => {
    setCreateSubCategory((prev) => ({ ...prev, [name]: value }));
    if (name === "mainId") {
      const res = data?.data?.find((item: BlogCategory) => item?._id === value);
      setSubData(res?.subCategories || []);
      setCreateSubCategory((prev) => ({ ...prev, subId: "" }));
    }
  };

  const handleCreate = async () => {
    try {
      const response = await createPost({
        data: { name: createSubCategory.name },
        path: `/sub-sub-category/${createSubCategory.mainId}/${createSubCategory.subId}`,
      });

      if (response?.data?.success) {
        toast.success(response.data.message, {
          autoClose: 3000,
        });
        refetch();
        setCreateSubCategory({ mainId: "", subId: "", name: "" });
      } else {
        toast.error("Failed to create Sub sub-category");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleEditClick = (
    mainId: string,
    subId: string,
    subSubId: string,
    name: string
  ) => {
    setEditData({ mainId, subId, subSubId, name });
  };

  const handleSaveClick = async () => {
    try {
      const response = await updatePost({
        path: `/sub-sub-category/${editData.mainId}/${editData.subId}/${editData.subSubId}`,
        data: { name: editData.name },
      });

      if (response?.data?.success) {
        toast.success(response.data.message, {
          autoClose: 5000,
        });
        refetch();
        setEditData({ mainId: "", subId: "", subSubId: "", name: "" });
      } else {
        toast.error("Failed to Update category");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCancelClick = () => {
    setEditData({ mainId: "", subId: "", subSubId: "", name: "" });
  };

  const toggleSubCategories = (categoryId: string) => {
    setShowSubCategories((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  const toggleSubSubCategories = (subCategoryId: string) => {
    setShowSubSubCategories((prevState) => ({
      ...prevState,
      [subCategoryId]: !prevState[subCategoryId],
    }));
  };

  const handleDelete = async (
    mainId: string,
    subId: string,
    subSubId: string
  ) => {
    if (window.confirm("Are you sure you want to continue?")) {
      try {
        const response = await deletePost({
          url: `/sub-sub-category/${mainId}/${subId}/${subSubId}`,
        });

        if (response?.data?.success) {
          toast.success(response.data.message, {
            autoClose: 3000,
          });
          refetch();
        } else {
          toast.error("Failed to delete category");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="md:flex flex-row w-full h-[400px] gap-2">
      {isLoading && <Loader />}
      <ToastContainer />
      <div className="flex flex-col w-full gap-5 p-10 border-b-2 border-gray-200 md:border-b-0 md:border-r-2">
        <h3 className="text-[18px]  font-bold text-gray-600">
          Create Sub Sub-Category
        </h3>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-[15px] font-bold ">
            Main Category
          </label>
          <select
            // className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
            className="w-full h-8 pl-2 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200"
            value={createSubCategory.mainId}
            onChange={(e) => handleChangesValue("mainId", e.target.value)}
          >
            <option value="">Select</option>
            {data?.data?.map((category: BlogCategory, index: number) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-bold text-[15px]">
            Sub-Category
          </label>
          <select
            // className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
            className="w-full h-8 pl-2 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200"
            value={createSubCategory.subId}
            onChange={(e) => handleChangesValue("subId", e.target.value)}
          >
            <option value="">Select</option>
            {subData?.map((category: BlogCategory, index: number) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-bold text-[15px]">
            Sub Sub-Category
          </label>
          <input
            value={createSubCategory.name}
            onChange={(e) => handleChangesValue("name", e.target.value)}
            // className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
            className="w-full h-8 pl-4 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200"
            type="text"
            placeholder="Enter Title"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            disabled={
              !createSubCategory.mainId ||
              !createSubCategory.subId ||
              !createSubCategory.name
            }
            className={`${
              createSubCategory.mainId &&
              createSubCategory.subId &&
              createSubCategory.name
                ? "bg-[#1e40af]"
                : // ? "bg-[#5a83bd]"
                  "bg-gray-500"
            } px-4 py-2 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
          >
            Save
          </button>
        </div>
      </div>
      <div className="p-4 max-h-[400px] overflow-auto w-full">
        {data?.data?.map((category: BlogCategory, index: number) => (
          <div key={index} className="mb-4 bg-[#f8f8f8] p-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-600">
                {category.name}
              </h2>
              {category?.subCategories?.length > 0 && (
                <button onClick={() => toggleSubCategories(category._id)}>
                  {/* {showSubCategories[category?._id] ? ( */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 transition-all duration-500 ${
                      showSubCategories[category?._id] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  {/* ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )} */}
                </button>
              )}
            </div>
            {showSubCategories[category?._id] && (
              <ul className="pl-6 mt-2 list-none">
                {category?.subCategories?.map((sub) => (
                  <li key={sub._id} className="mb-2">
                    <div className="flex items-center justify-between mr-2">
                      <span className="text-base font-bold text-gray-600">
                        {sub?.name}
                      </span>
                      {sub?.subSubCategories?.length > 0 && (
                        <button
                          onClick={() => toggleSubSubCategories(sub?._id)}
                        >
                          {/* {showSubSubCategories[sub?._id] ? ( */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-4 h-4 transition-all duration-500 ${
                              showSubSubCategories[sub?._id] ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          {/* ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )} */}
                        </button>
                      )}
                    </div>
                    {showSubSubCategories[sub?._id] && (
                      <ul className="pl-6 mt-2 mr-2 list-disc">
                        {sub?.subSubCategories?.map((subSub) => (
                          <li
                            key={subSub?._id}
                            className="mb-2 text-base font-medium text-gray-600"
                          >
                            <div className="flex items-center justify-between w-full">
                              {editData?.subSubId === subSub?._id ? (
                                <div className="grid w-full gap-2">
                                  <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) =>
                                      setEditData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                      }))
                                    }
                                    className="w-full px-2 py-1 border rounded-md"
                                  />
                                  <div className="flex justify-end">
                                    <button
                                      disabled={
                                        !editData.mainId ||
                                        !editData.subId ||
                                        !editData.name ||
                                        !editData.subSubId
                                      }
                                      onClick={handleSaveClick}
                                      className="px-3 py-1 ml-2 text-white bg-green-500 rounded"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={handleCancelClick}
                                      className="px-3 py-1 ml-2 text-white bg-red-500 rounded"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <span className="mr-2 text-base font-medium text-gray-600">
                                    {subSub?.name}
                                  </span>
                                  <div className="flex flex-row gap-5">
                                    <button
                                      onClick={() =>
                                        handleDelete(
                                          category?._id,
                                          sub?._id,
                                          subSub?._id
                                        )
                                      }
                                    >
                                      <DeleteICONSVG
                                        height={20}
                                        width={20}
                                        fill={"#fe2828"}
                                      />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleEditClick(
                                          category?._id,
                                          sub?._id,
                                          subSub?._id,
                                          subSub?.name
                                        )
                                      }
                                    >
                                      <EditICONSVG
                                        height={20}
                                        width={20}
                                        fill={"#5b5a5a"}
                                      />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
const Tab4: React.FC = () => {
  interface StateProp {
    mainId: string;
    subId: string;
    subSubId: string;
    name: string;
  }
  interface EditProps {
    mainId: string;
    subId: string;
    subSubId: string;
    innerId: string;
    name: string;
  }
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data, refetch, isLoading } = useGetDataQuery({
    url: "/get-blog-category",
  });

  const [subData, setSubData] = useState<subcategory[]>([]);
  const [subSubData, setSubSubData] = useState<subSubCategories[]>([]);
  const [createInnerCategory, setCreateInnerCategory] = useState<StateProp>({
    mainId: "",
    subId: "",
    subSubId: "",
    name: "",
  });
  const [showSubCategories, setShowSubCategories] = useState<
    Record<string, boolean>
  >({});
  const [showSubSubCategories, setShowSubSubCategories] = useState<
    Record<string, boolean>
  >({});
  const [showInnerCategories, setShowInnerCategories] = useState<
    Record<string, boolean>
  >({});
  const [editData, setEditData] = useState<EditProps>({
    mainId: "",
    subId: "",
    subSubId: "",
    innerId: "",
    name: "",
  });

  const handleChangesValue = (name: string, value: string) => {
    setCreateInnerCategory((prev) => ({ ...prev, [name]: value }));
    if (name === "mainId") {
      const res = data?.data?.find((item: BlogCategory) => item?._id === value);
      setSubData(res?.subCategories || []);
      setSubSubData([]);
      setCreateInnerCategory((prev) => ({ ...prev, subId: "", subSubId: "" }));
    } else if (name === "subId") {
      const res = subData.find((item: subcategory) => item?._id === value);
      setSubSubData(res?.subSubCategories || []);
      setCreateInnerCategory((prev) => ({ ...prev, subSubId: "" }));
    }
  };

  const handleCreate = async () => {
    try {
      const response = await createPost({
        data: { name: createInnerCategory?.name },
        path: `/inner-category/${createInnerCategory?.mainId}/${createInnerCategory?.subId}/${createInnerCategory?.subSubId}`,
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message, {
          autoClose: 3000,
        });
        refetch();
        setCreateInnerCategory((prev) => ({ ...prev, name: "" }));
      } else {
        toast.error("Failed to create inner category");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleEditClick = (
    mainId: string,
    subId: string,
    subSubId: string,
    innerId: string,
    name: string
  ) => {
    setEditData({ mainId, subId, subSubId, innerId, name });
  };

  const handleSaveClick = async () => {
    try {
      const response = await updatePost({
        path: `/inner-category/${editData?.mainId}/${editData?.subId}/${editData?.subSubId}/${editData?.innerId}`,
        data: { name: editData.name },
      });

      if (response?.data?.success) {
        toast.success(response.data.message, {
          autoClose: 5000,
        });
        refetch();
        setEditData({
          mainId: "",
          subId: "",
          subSubId: "",
          innerId: "",
          name: "",
        });
      } else {
        toast.error("Failed to update inner category");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCancelClick = () => {
    setEditData({ mainId: "", subId: "", subSubId: "", innerId: "", name: "" });
  };

  const toggleSubCategories = (categoryId: string) => {
    setShowSubCategories((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  const toggleSubSubCategories = (subCategoryId: string) => {
    setShowSubSubCategories((prevState) => ({
      ...prevState,
      [subCategoryId]: !prevState[subCategoryId],
    }));
  };

  const toggleInnerCategories = (innerCategoryId: string) => {
    setShowInnerCategories((prevState) => ({
      ...prevState,
      [innerCategoryId]: !prevState[innerCategoryId],
    }));
  };

  const handleDelete = async (
    mainId: string,
    subId: string,
    subSubId: string,
    innerId: string
  ) => {
    if (window.confirm("Are you sure you want to continue?")) {
      try {
        const response = await deletePost({
          url: `/inner-category/${mainId}/${subId}/${subSubId}/${innerId}`,
        });

        if (response?.data?.success) {
          toast.success(response.data.message, {
            autoClose: 3000,
          });
          refetch();
        } else {
          toast.error("Failed to delete inner category");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="md:flex flex-row md:h-[460px] w-full gap-2">
      {isLoading && <Loader />}
      <ToastContainer />
      <div className="flex flex-col w-full gap-5 p-10 border-b-2 border-gray-200 md:border-b-0 md:border-r-2">
        <h3 className=" text-[18px] font-bold text-gray-600">
          Create Inner Category
        </h3>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-bold text-[15px] ">
            Main Category
          </label>
          <select
            className="w-full h-8 pl-2 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200"
            // className="p-2 border rounded"
            value={createInnerCategory?.mainId}
            onChange={(e) => handleChangesValue("mainId", e.target.value)}
          >
            <option value="">Select</option>
            {data?.data?.map((category: BlogCategory, index: number) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-bold text-[15px] ">
            Sub-Category
          </label>
          <select
            className="w-full h-8 pl-2 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200"
            // className="p-2 border rounded"
            value={createInnerCategory?.subId}
            onChange={(e) => handleChangesValue("subId", e.target.value)}
          >
            <option value="">Select</option>
            {subData?.map((category: subcategory, index: number) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-[15px] font-bold">
            Sub Sub-Category
          </label>
          <select
            // className="p-2 border rounded"
            className="w-full h-8 pl-2 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200"
            value={createInnerCategory.subSubId}
            onChange={(e) => handleChangesValue("subSubId", e.target.value)}
          >
            <option value="">Select</option>
            {subSubData?.map((category: subSubCategories, index: number) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-bold text-[15px]">
            Inner Category
          </label>
          <input
            value={createInnerCategory.name}
            onChange={(e) => handleChangesValue("name", e.target.value)}
            className="w-full h-8 pl-2 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200"
            // className="border border-[#6e6d6d5b] outline-none  px-2 py-1"
            type="text"
            placeholder="Enter Title"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            disabled={
              !createInnerCategory?.mainId ||
              !createInnerCategory?.subId ||
              !createInnerCategory?.subSubId ||
              !createInnerCategory?.name
            }
            className={`${
              createInnerCategory?.mainId &&
              createInnerCategory?.subId &&
              createInnerCategory?.subSubId &&
              createInnerCategory?.name
                ? "bg-[#1e40af]"
                : // ? "bg-[#5a83bd]"
                  "bg-gray-500"
            }  px-4 py-2 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
          >
            save
          </button>
        </div>
      </div>
      <div className=" max-h-[460px] overflow-auto  w-full  p-3 ">
        {data?.data?.map((category: BlogCategory, index: number) => (
          <div key={index} className="mb-4 bg-[#f8f8f8] rounded-[7px] p-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-600">
                {category?.name}
              </h2>
              {category?.subCategories?.length > 0 && (
                <button onClick={() => toggleSubCategories(category?._id)}>
                  {/* {showSubCategories[category?._id] ? ( */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 transition-all duration-500 ${
                      showSubCategories[category?._id] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={`M5 15l7-7 7 7`}
                    />
                  </svg>
                </button>
              )}
            </div>
            {showSubCategories[category?._id] && (
              <ul className="px-3 pl-6 mt-2 list-non">
                {category?.subCategories?.map((sub) => (
                  <li key={sub?._id} className="mb-2">
                    <div className="flex items-center justify-between">
                      <span className="mr-2 text-base font-bold text-gray-600">
                        {sub?.name}
                      </span>
                      {sub?.subSubCategories?.length > 0 && (
                        <button onClick={() => toggleSubSubCategories(sub._id)}>
                          {/* {showSubSubCategories[sub?._id] ? ( */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-4 h-4 transition-all duration-500 ${
                              showSubSubCategories[sub?._id] ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    {showSubSubCategories[sub?._id] && (
                      <ul className="p-3 py-0 pl-6 mt-2 list-none">
                        {sub?.subSubCategories?.map((subSub) => (
                          <li key={subSub._id} className="mb-2">
                            <div className="flex items-center justify-between">
                              <span className="mr-2 font-bold text-gray-600">
                                {subSub?.name}
                              </span>
                              {subSub?.innerCategories?.length > 0 && (
                                <button
                                  onClick={() =>
                                    toggleInnerCategories(subSub?._id)
                                  }
                                >
                                  {/* {showInnerCategories[subSub?._id] ? ( */}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-4 h-4 transition-all duration-500 ${
                                      showInnerCategories[subSub?._id]
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 15l7-7 7 7"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                            {showInnerCategories[subSub?._id] && (
                              <ul className="pl-6 mt-2 list-disc">
                                {subSub?.innerCategories?.map((inner) => (
                                  <li key={inner?._id} className="mb-2">
                                    <div className="flex items-center justify-between">
                                      {editData.innerId === inner?._id ? (
                                        <div className="grid w-full gap-2">
                                          <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) =>
                                              setEditData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                              }))
                                            }
                                            className="px-2 py-1 border rounded-md"
                                          />
                                          <div className="flex justify-end">
                                            <button
                                              onClick={handleSaveClick}
                                              className="px-3 py-1 ml-2 text-white bg-green-500 rounded"
                                            >
                                              Save
                                            </button>
                                            <button
                                              onClick={handleCancelClick}
                                              className="px-3 py-1 ml-2 text-white bg-red-500 rounded"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <span className="mr-2 text-sm font-bold text-gray-600">
                                            {inner?.name}
                                          </span>
                                          <div className="flex flex-row gap-5">
                                            <button
                                              onClick={() =>
                                                handleDelete(
                                                  category._id,
                                                  sub?._id,
                                                  subSub._id,
                                                  inner?._id
                                                )
                                              }
                                            >
                                              <DeleteICONSVG
                                                height={20}
                                                width={20}
                                                fill={"#fe2828"}
                                              />
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleEditClick(
                                                  category?._id,
                                                  sub?._id,
                                                  subSub._id,
                                                  inner?._id,
                                                  inner?.name
                                                )
                                              }
                                            >
                                              <EditICONSVG
                                                height={20}
                                                width={20}
                                                fill={"#5b5a5a"}
                                              />
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
