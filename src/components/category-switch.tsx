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
  const { data, refetch, isLoading } = useGetDataQuery({ url: "/get-blog-category" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [createData, setCreateData] = useState<string>("");

  const handleEditClick = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSaveClick = async () => {
    try {
      const response = await updatePost({
        path: `/main-category/${editingId}`,
        data: { name: editingName },
      });
      if (response?.data?.success) {
        toast.success(response?.data?.message, {
          autoClose: 5000,
        });
        refetch();
        setEditingId(null);
        setEditingName("");
      } else {
        toast.error("Failed to Update main category");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleClickCreate = async () => {
    try {
      const response = await createPost({
        data: { name: createData },
        path: "main-category",
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message, {
          autoClose: 5000,
        });
        refetch();
        setCreateData("");
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
      <div className="flex flex-row gap-2 w-full">
      {isLoading &&<Loader/>}
        <div className="flex flex-col gap-5 bg-[#ffffff] p-10 rounded-[7px] w-full">
          <h3 className="text-[18px] font-[600] text-center">
            Create Main Category
          </h3>
          <div className="flex flex-col gap-1">
            <label className="text-[#303030] text-[15px] font-[600]">
              Main Category
            </label>
            <input
              value={createData}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCreateData(e.target.value)
              }
              className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
              type="text"
            />
          </div>

          <button
            onClick={handleClickCreate}
            disabled={!createData}
            className={`${
              createData ? "bg-[#5a83bd]" : "bg-gray-500"
            } p-1 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
          >
            Save
          </button>
        </div>

        <div className="w-full rounded-[7px] bg-[#ffffff] max-h-[400px] overflow-auto ">
          <ul className="list-none p-2">
            {Array.isArray(data?.data) ? (
              data?.data?.map((item: BlogCategory, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-2 gap-3 px-4 border-b border-gray-400 mb-2 "
                >
                  {editingId === item._id ? (
                    <>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 mr-2 px-2 py-1 border rounded"
                      />
                      <button
                        onClick={handleSaveClick}
                        className="mr-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="px-4 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{item.name}</span>
                      <div className="flex flex-row gap-5">
                        <button onClick={() => handleShowAlert(item?._id)}>
                          <DeleteICONSVG
                            height={20}
                            width={20}
                            fill={"#fe2828"}
                          />
                        </button>
                        <button
                          onClick={() => handleEditClick(item?._id, item?.name)}
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
  const { data, refetch, isLoading } = useGetDataQuery({ url: "/get-blog-category" });
  const [editId, setEditId] = useState<editprops>({
    mainId: "",
    subId: "",
    name: "",
  });
  interface ShowSubCategories {
    [key: string]: boolean;
  }
  const [showSubCategories, setShowSubCategories] = useState<ShowSubCategories>({});
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
    <div className="flex flex-row gap-2 w-full ">
      {isLoading &&<Loader/>}
      <ToastContainer />
      <div className="flex flex-col gap-5 bg-[#ffffff] p-10 rounded-[7px] w-full">
        <h3 className=" text-[18px] font-[600] text-center">
          Create Sub-Category
        </h3>
        <div className="flex flex-col gap-1">
          <label className="text-[#303030] text-[15px] font-[600]">
            Main Category
          </label>
          <select
            className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
            value={createSubCategory?.mainId}
            onChange={(e) => handleChangesValue("mainId", e.target.value)}
          >
            <option value="">select</option>
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
          <label className="text-[#303030] text-[15px] font-[600]">
            Sub-Category
          </label>
          <input
            value={createSubCategory?.name}
            onChange={(e) => handleChangesValue("name", e.target.value)}
            className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
            type="text"
          />
        </div>

        <button
          onClick={HanldeCreate}
          disabled={!createSubCategory?.name && !createSubCategory?.mainId}
          className={` ${
            createSubCategory?.name && createSubCategory?.mainId
              ? "bg-[#5a83bd]"
              : "bg-gray-500"
          } p-1 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
        >
          save
        </button>
      </div>
      <div className=" w-full mt-1 max-h-[400px] overflow-auto bg-[#ffffff]">
        <ul className="list-none w-full ">
          {data?.data?.map((category: BlogCategory, index: number) => (
            <div key={index} className="mb-4 bg-[#f8f8f8] p-1 rounded-[7px]">
              <div className="flex items-center justify-between ">
                <h2 className="text-sm font-bold">{category?.name}</h2>
                {category?.subCategories?.length > 0 && (
                  <button onClick={() => toggleSubCategories(category?._id)}>
                    {showSubCategories[category?._id] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
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
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
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
                    )}
                  </button>
                )}
              </div>
              {showSubCategories[category?._id] && (
                <ul className="list-disc pl-6 mt-2 ">
                  {category?.subCategories?.map((sub) => (
                    <li
                      key={sub?._id}
                      className="mb-2 flex flex-row justify-between"
                    >
                      {editId?.subId === sub?._id ? (
                        <>
                          <input
                            type="text"
                            value={editId?.name}
                            onChange={(e) =>
                              setEditId((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="border px-2 py-1"
                          />
                          <button
                            disabled={
                              !editId?.mainId && !editId?.subId && !editId?.name
                            }
                            onClick={handleSaveClick}
                            className="bg-green-500 text-white px-4  ml-2 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="bg-red-500 text-white px-4  ml-2 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="mr-2">{sub?.name}</span>
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
  const { data, refetch, isLoading } = useGetDataQuery({ url: "/get-blog-category" });

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
    <div className="flex flex-row gap-2 w-full">
      {isLoading &&<Loader/>}
      <ToastContainer />
      <div className="flex flex-col gap-5 bg-[#ffffff] p-10 rounded-[7px] w-full">
        <h3 className="text-[18px] font-[600] text-center">
          Create Sub Sub-Category
        </h3>
        <div className="flex flex-col gap-1">
          <label className="text-[#303030] text-[15px] font-[600]">
            Main Category
          </label>
          <select
            className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
            value={createSubCategory.mainId}
            onChange={(e) => handleChangesValue("mainId", e.target.value)}
          >
            <option value="">select</option>
            {data?.data?.map((category: BlogCategory, index: number) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#303030] text-[15px] font-[600]">
            Sub-Category
          </label>
          <select
            className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
            value={createSubCategory.subId}
            onChange={(e) => handleChangesValue("subId", e.target.value)}
          >
            <option value="">select</option>
            {subData?.map((category: BlogCategory, index: number) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#303030] text-[15px] font-[600]">
            Sub Sub-Category
          </label>
          <input
            value={createSubCategory.name}
            onChange={(e) => handleChangesValue("name", e.target.value)}
            className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
            type="text"
          />
        </div>
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
              ? "bg-[#5a83bd]"
              : "bg-gray-500"
          } p-1 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
        >
          Save
        </button>
      </div>
      <div className="p-4 h-[400px] bg-[#ffffff] rounded-[7px]  overflow-auto w-full">
        {data?.data?.map((category: BlogCategory, index: number) => (
          <div key={index} className="mb-4 bg-[#f8f8f8] p-1 rounded-[7px]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">{category.name}</h2>
              {category?.subCategories?.length > 0 && (
                <button onClick={() => toggleSubCategories(category._id)}>
                  {showSubCategories[category?._id] ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
                  )}
                </button>
              )}
            </div>
            {showSubCategories[category?._id] && (
              <ul className="pl-6 mt-2 list-none">
                {category?.subCategories?.map((sub) => (
                  <li key={sub._id} className="mb-2">
                    <div className="flex items-center justify-between mr-2">
                      <span>{sub?.name}</span>
                      {sub?.subSubCategories?.length > 0 && (
                        <button
                          onClick={() => toggleSubSubCategories(sub?._id)}
                        >
                          {showSubSubCategories[sub?._id] ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
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
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
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
                          )}
                        </button>
                      )}
                    </div>
                    {showSubSubCategories[sub?._id] && (
                      <ul className="list-disc pl-6 mr-2 mt-2">
                        {sub?.subSubCategories?.map((subSub) => (
                          <li key={subSub?._id} className="mb-2">
                            <div className="flex items-center justify-between">
                              {editData?.subSubId === subSub?._id ? (
                                <>
                                  <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) =>
                                      setEditData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                      }))
                                    }
                                    className="border px-2 py-1"
                                  />
                                  <button
                                    disabled={
                                      !editData.mainId ||
                                      !editData.subId ||
                                      !editData.name ||
                                      !editData.subSubId
                                    }
                                    onClick={handleSaveClick}
                                    className="bg-green-500 text-white px-4 ml-2 rounded"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelClick}
                                    className="bg-red-500 text-white px-4 ml-2 rounded"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="mr-2">{subSub?.name}</span>
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
  const { data, refetch, isLoading } = useGetDataQuery({ url: "/get-blog-category" });

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
    <div className="flex flex-row gap-2 w-full">
      {isLoading &&<Loader/>}
      <ToastContainer />
      <div className="flex flex-col gap-5 bg-[#ffff] p-10 rounded-[7px] w-full">
        <h3 className=" text-[18px] font-[600] text-center">
          Create Inner Category
        </h3>
        <div className="flex flex-col gap-1">
          <label className="text-[#303030] text-[15px] font-[600]">
            Main Category
          </label>
          <select
            className="p-2 border rounded"
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
          <label className="text-[#303030] text-[15px] font-[600]">
            Sub-Category
          </label>
          <select
            className="p-2 border rounded"
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
          <label className="text-[#303030] text-[15px] font-[600]">
            Sub Sub-Category
          </label>
          <select
            className="p-2 border rounded"
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
          <label className="text-[#303030] text-[15px] font-[600]">
            Inner Category
          </label>
          <input
            value={createInnerCategory.name}
            onChange={(e) => handleChangesValue("name", e.target.value)}
            className="border border-[#6e6d6d5b] outline-none rounded-[7px] px-2 py-1"
            type="text"
          />
        </div>

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
              ? "bg-[#5a83bd]"
              : "bg-gray-500"
          }  p-1 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
        >
          save
        </button>
      </div>
      <div className=" h-[400px] overflow-auto  w-full bg-[#ffff] p-3 rounded-[7px]">
        {data?.data?.map((category: BlogCategory, index: number) => (
          <div key={index} className="mb-4 bg-[#f8f8f8] rounded-[7px] p-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold ">{category?.name}</h2>
              {category?.subCategories?.length > 0 && (
                <button onClick={() => toggleSubCategories(category?._id)}>
                  {showSubCategories[category?._id] ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
                  )}
                </button>
              )}
            </div>
            {showSubCategories[category?._id] && (
              <ul className="list-non pl-6 mt-2 px-3">
                {category?.subCategories?.map((sub) => (
                  <li key={sub?._id} className="mb-2">
                    <div className="flex items-center justify-between">
                      <span className="mr-2">{sub?.name}</span>
                      {sub?.subSubCategories?.length > 0 && (
                        <button onClick={() => toggleSubSubCategories(sub._id)}>
                          {showSubSubCategories[sub?._id] ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
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
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
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
                          )}
                        </button>
                      )}
                    </div>
                    {showSubSubCategories[sub?._id] && (
                      <ul className="list-non pl-6 mt-2 p-3">
                        {sub?.subSubCategories?.map((subSub) => (
                          <li key={subSub._id} className="mb-2">
                            <div className="flex items-center justify-between">
                              <span className="mr-2">{subSub?.name}</span>
                              {subSub?.innerCategories?.length > 0 && (
                                <button
                                  onClick={() =>
                                    toggleInnerCategories(subSub?._id)
                                  }
                                >
                                  {showInnerCategories[subSub?._id] ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6"
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
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6"
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
                                  )}
                                </button>
                              )}
                            </div>
                            {showInnerCategories[subSub?._id] && (
                              <ul className="list-disc pl-6 mt-2">
                                {subSub?.innerCategories?.map((inner) => (
                                  <li key={inner?._id} className="mb-2">
                                    <div className="flex items-center justify-between">
                                      {editData.innerId === inner?._id ? (
                                        <>
                                          <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) =>
                                              setEditData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                              }))
                                            }
                                            className="border px-2 py-1"
                                          />
                                          <button
                                            onClick={handleSaveClick}
                                            className="bg-green-500 text-white px-4  ml-2 rounded"
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={handleCancelClick}
                                            className="bg-red-500 text-white px-4 ml-2 rounded"
                                          >
                                            Cancel
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <span className="mr-2">
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
