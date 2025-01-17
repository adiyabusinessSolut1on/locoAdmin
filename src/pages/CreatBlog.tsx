import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { BlogCategory } from "../types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import uploadImage from "../firebase_image/image";
import JoditTextEditor from "../components/editorNew"

import { FaBloggerB, FaCaretDown } from "react-icons/fa";
import { getMediaUrl } from "../utils/getMediaUrl";

interface Props {
  _id: string;
  name: string;
}

interface StateProps {
  mainId?: string;
  subid?: string;
  subsubid?: string;
  innerid?: string;
  maincategory?: string;
  subcategory?: string;
  subsubcategory?: string;
  innercategory?: string;
  categoryId: string;
  categoryName: string;
  title: string;
  slug: string;
  thumnail: any;
  content: string;
  imageTitle: string;
}
interface popostate {
  maincategoryData: Props[];
  subcategoryData: Props[];
  subsubcategoryData: Props[];
  innercategoryData: Props[];
}

const CreatBlog = () => {
  // const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();

  const { id } = useParams();
  // console.log("id: ", id);

  const { data: blogData, isError } = useGetDataQuery({
    url: `/blog/get-blog-using-Id/${id}`,
  });

  const { data } = useGetDataQuery({ url: "/get-blog-category" });
  // console.log(data, "update Blog");
  const [category, setCategory] = useState<popostate>({
    maincategoryData: [],
    subcategoryData: [],
    subsubcategoryData: [],
    innercategoryData: [],
  });
  interface blogACt {
    _id: string,
    name: string
  }

  const [imagePrivew, setImagePrivew] = useState<any>()
  const [state, setState] = useState<StateProps>({
    maincategory: "",
    mainId: "",
    subid: "",
    subsubid: "",
    categoryId: blogData?.data?.categoryId || "",
    categoryName: blogData?.data?.categoryName || "",
    innerid: "",
    subcategory: "",
    subsubcategory: "",
    innercategory: "",
    title: blogData?.data?.title || "",
    slug: "",
    thumnail: getMediaUrl(blogData?.data?.thumnail, "blog") || "",
    content: blogData?.data?.content || "",
    imageTitle: blogData?.data?.thumnail?.slice(67, data?.image?.indexOf("%")) || "",
  });

  const handleBlogcat = (category: blogACt) => {
    setState((prev) => ({ ...prev, categoryId: category?._id, categoryName: category?.name }))
  }

  const [isOpen, setOpen] = useState({
    maincategory: false,
    subcategory: false,
    subsubcategory: false,
    innercategory: false,
  });

  const isUpdate = !!blogData;

  useEffect(() => {
    if (isUpdate && !isError) {
      setState({
        title: blogData?.data?.title,
        thumnail: getMediaUrl(blogData?.data?.thumnail, "blog"),
        slug: blogData?.data?.slug,
        content: blogData?.data?.content,
        categoryId: blogData?.data?.categoryId,
        categoryName: blogData?.data?.categoryName,
        imageTitle: blogData?.data?.thumnail?.slice(72, blogData?.data?.thumnail?.indexOf("%2F")) || "",
        maincategory: "",
        mainId: "",
        subid: "",
        subsubid: "",
        innerid: "",
        subcategory: "",
        subsubcategory: "",
        innercategory: "",
      });
      setImagePrivew(getMediaUrl(blogData?.data?.thumnail, "blog"))
    }
  }, [isUpdate, isError, blogData]);

  const makeSlug = (value: string) => {
    return value.toLowerCase().replace(/\s+/g, "-");
  };

  const handleDropChange = (name: string, value: string) => {
    console.log(name, value, "change text");
    if (name === "maincategory") {
      const mainCategory = data?.data?.find(
        (cat: BlogCategory) => cat._id === value
      );
      setCategory((prev) => ({
        ...prev,
        subcategoryData: mainCategory ? mainCategory?.subCategories : [],
        subsubcategoryData: [],
        innercategoryData: [],
      }));
      setState((prev) => ({
        ...prev,
        maincategory: mainCategory ? mainCategory.name : "",
        mainId: value,
        subid: "",
        subsubid: "",
        innerid: "",
        subcategory: "",
        subsubcategory: "",
        innercategory: "",
      }));
    } else if (name === "subcategory") {
      const subCategory = category.subcategoryData.find(
        (cat: Props) => cat._id === value
      );
      setCategory((prev) => ({
        ...prev,
        //@ts-expect-error no error
        subsubcategoryData: subCategory ? subCategory?.subSubCategories : [],
        innercategoryData: [],
      }));
      setState((prev) => ({
        ...prev,
        subcategory: subCategory ? subCategory.name : "",

        subid: value,
        subsubid: "",
        innerid: "",
        subsubcategory: "",
        innercategory: "",
      }));
    } else if (name === "subsubcategory") {
      const subSubCategory = category?.subsubcategoryData?.find(
        (cat: Props) => cat._id === value
      );
      setCategory((prev) => ({
        ...prev,
        innercategoryData: subSubCategory
          ? //@ts-expect-error mooj
          subSubCategory?.innerCategories
          : [],
      }));
      setState((prev) => ({
        ...prev,
        subsubcategory: subSubCategory ? subSubCategory.name : "",

        subsubid: value,
        innerid: "",
        innercategory: "",
      }));
    } else if (name === "innercategory") {
      const innerCategory = category?.innercategoryData?.find(
        (cat: Props) => cat._id === value
      );
      setState((prev) => ({
        ...prev,
        innercategory: innerCategory ? innerCategory.name : "",
        innerid: value,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setOpen((prev) => ({
      ...prev,
      [name]: false,
    }));
  };


  // const [progressStatus, setProgressStatus] = useState<number | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    // console.log("selected file: ", selectedFile);

    if (selectedFile) {
      try {
        /* const imageUrl = await uploadImage(
          selectedFile.name,
          selectedFile,
          setProgressStatus
        ); */
        setImagePrivew(URL.createObjectURL(selectedFile))
        setState({
          ...state,
          thumnail: selectedFile,
          imageTitle: selectedFile.name,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // toast.loading("Checking Details");
      /* const payload = {
        categoryId: state?.categoryId,
        categoryName: state?.categoryName,
        title: state?.title,
        slug: state?.slug,
        thumnail: state?.thumnail,
        content: state?.content,
      }; */
      const formData = new FormData()
      formData.append("categoryId", state?.categoryId)
      formData.append("categoryName", state?.categoryName)
      formData.append("title", state?.title)
      formData.append("slug", state?.slug)
      formData.append("thumnail", state?.thumnail)
      formData.append("content", state?.content)

      const response = await updatePost({ data: formData, method: isUpdate && !isError ? "PUT" : "POST", path: isUpdate && !isError ? `/blog/update-blog/${id}` : "/blog/create", }).unwrap();

      // console.log(response);

      if (response?.success) {
        toast.dismiss();
        toast.success(response?.message, { autoClose: 5000, });
        clearhandler();
      } else {
        toast.dismiss();
        toast.error(`Failed to ${isUpdate && !isError ? "Update Blog" : "Create Blog"} create Blog`);
      }
    } catch (error) {
      toast.dismiss();
      // console.error(`Error ${isUpdate && !isError ? "Updating Blog" : "Creating Blog"} :`,error);
      toast.error("An error occurred");
    }
  };

  const clearhandler = () => {
    setState({
      maincategory: "",
      mainId: "",
      subid: "",
      subsubid: "",
      innerid: "",
      categoryId: "",
      categoryName: "",
      subcategory: "",
      subsubcategory: "",
      innercategory: "",
      title: "",
      slug: "",
      thumnail: "",
      content: "",
      imageTitle: "",
    });

    navigate("/creat-blog/blogs-list");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //@ts-expect-error //ggjh
    const { name, value, type, checked } = e.target;

    if (name === "title")
      setState((prev) => ({
        ...prev,
        slug: makeSlug(value),
      }));

    setState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="w-full md:px-4 md:ml-4 md:pl-0">
      <ToastContainer />
      <form className="w-full h-[calc(100vh-6rem)] overflow-hidden   rounded-md" onSubmit={submitHandler}>
        <div className="flex-1 h-full p-6 rounded font-montserrat">
          <div className="flex pb-2">
            <h2 className="md:text-4xl text-[28px] font-bold text-gray-600 font-mavenPro">Blog Form</h2>
          </div>
          <div className="flex items-center justify-end w-full pb-2">
            {/* <button> */}
            <Link to={"/creat-blog/blogs-list"} className="px-2 py-2 text-sm font-semibold text-white bg-blue-800 rounded-md font-mavenPro">View Blog List</Link>
            {/* </button> */}
          </div>
          <div className="h-[calc(100vh-16rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
            <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
              {/* {state.thumnail && } */}
              <div className="w-[200px] h-[200px] bg-blue-100 text-white rounded-md col-span-1 md:col-span-2">
                {imagePrivew ? (
                  <img src={imagePrivew} alt={state?.title} className="rounded-[5px] object-contain w-full h-full" />
                ) : (
                  <p className="flex items-center justify-center w-full h-full gap-4 p-4 text-sm">
                    <FaBloggerB className="w-16 h-12 text-gray-500" />
                    <span className="font-medium text-gray-500 w-fit">Here Uploade Image will be shown</span>
                  </p>
                )}
              </div>
              <div className="relative w-full h-full">
                <input type="file" name="image" onChange={handleImageChange} className="hidden" id="file-upload" />
                {/* <label htmlFor="file-upload" className={`px-4 py-2 pl-24 relative ${progressStatus ? "pb-2" : ""} w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}> */}
                <label htmlFor="file-upload" className={`px-4 py-2 pl-24 relative w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}>
                  {state.imageTitle || "Choose a file"}
                  <span className="text-gray-400 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-blue-200">Browse</span>
                </label>
                {/* {progressStatus !== null && progressStatus !== 0 && (
                  <>
                    <div className="absolute inset-0 z-10 flex items-end">
                      <div className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]" style={{ width: `${progressStatus}%` }}></div>
                    </div>
                  </>
                )} */}
              </div>

              <input value={state.title} type="text" onChange={handleChange} name="title" className="w-full h-10 pl-4 font-medium bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200" placeholder="Enter Blog Title" required />

              {/* Main Category Dropdown */}
              {isError && (
                <div className="relative">
                  <div className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-blue-100 border-transparent rounded-md cursor-pointer focus:border-blue-200" onClick={() => setOpen({ ...isOpen, maincategory: !isOpen.maincategory })}>
                    {state?.maincategory !== "" ? state.maincategory : "Select Main Category"}
                    <FaCaretDown className="m-1" />
                  </div>
                  <ul className={`mt-2 p-2  overflow-auto rounded-md w-32 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${isOpen.maincategory ? "max-h-60" : "hidden"} custom-scrollbar`}>
                    {data?.data?.length > 0 ? (
                      data?.data?.map((main: BlogCategory, i: number) => (
                        <li key={i} className={`p-2 mb-2 text-sm text-[#DEE1E2]  rounded-md cursor-pointer hover:bg-blue-200/60 ${state?.maincategory === main?.name ? "bg-rose-600" : ""}`}
                          onClick={() => {
                            handleDropChange("maincategory", main?._id)
                            handleBlogcat({ _id: main?._id, name: main?.name })
                          }
                          }
                        >
                          <span>{main?.name}</span>
                        </li>
                      ))
                    ) : (
                      <div>Data Not Found</div>
                    )}
                  </ul>
                </div>
              )}

              {/* Sub Category Dropdown */}
              {category?.subcategoryData?.length > 0 && (
                <div className="relative">
                  <div className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-blue-100 border-transparent rounded-md cursor-pointer focus:border-blue-200" onClick={() => setOpen({ ...isOpen, subcategory: !isOpen?.subcategory })}>
                    {state?.subcategory !== "" ? state?.subcategory : "Select Sub Category"}
                    <FaCaretDown className="m-1" />
                  </div>
                  <ul className={`mt-2 p-2 overflow-auto rounded-md w-32 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${isOpen?.subcategory ? "max-h-60" : "hidden"} custom-scrollbar`}>
                    {category?.subcategoryData?.map((sub, i) => (
                      <li key={i} className={`p-2 mb-2 text-sm text-[#DEE1E2]  rounded-md cursor-pointer hover:bg-blue-200/60 ${state.subcategory === sub?.name ? "bg-rose-600" : ""}`}
                        onClick={() => {
                          handleDropChange("subcategory", sub?._id)
                          handleBlogcat({ _id: sub?._id, name: sub?.name })
                        }
                        }
                      >
                        <span>{sub?.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SubSub Category Dropdown */}
              {category?.subsubcategoryData?.length > 0 && (
                <div className="relative">
                  <div className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-blue-100 border-transparent rounded-md cursor-pointer focus:border-blue-200" onClick={() => setOpen({ ...isOpen, subsubcategory: !isOpen.subsubcategory, })}>
                    {state.subsubcategory !== "" ? state.subsubcategory : "Select Sub-Sub Category"}
                    <FaCaretDown className="m-1" />
                  </div>
                  <ul className={`mt-2 p-2 rounded-md overflow-auto w-32 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${isOpen.subsubcategory ? "max-h-60" : "hidden"} custom-scrollbar`}>
                    {category?.subsubcategoryData?.map((subsub, i) => (
                      <li key={i} className={`p-2 mb-2 text-sm text-[#DEE1E2]  rounded-md cursor-pointer hover:bg-blue-200/60 ${state.subsubcategory === subsub?.name ? "bg-rose-600" : ""}`}
                        onClick={() => {
                          handleDropChange("subsubcategory", subsub?._id)
                          handleBlogcat({ _id: subsub?._id, name: subsub?.name })
                        }
                        }
                      >
                        <span>{subsub?.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* inner Category Dropdown */}
              {category?.innercategoryData?.length > 0 && (
                <div className="relative">
                  <div className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-blue-100 border-transparent rounded-md cursor-pointer focus:border-blue-200" onClick={() => setOpen({ ...isOpen, innercategory: !isOpen.innercategory, })}>
                    {state?.innercategory !== "" ? state?.innercategory : "Select Inner Category"}
                    <FaCaretDown className="m-1" />
                  </div>
                  <ul className={`mt-2 p-2 rounded-md overflow-auto w-32 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${isOpen?.innercategory ? "max-h-60" : "hidden"} custom-scrollbar`}>
                    {category?.innercategoryData?.map((iner, i) => (
                      <li key={i} className={`p-2 mb-2 text-sm text-[#DEE1E2]  rounded-md cursor-pointer hover:bg-blue-200/60 ${state.innercategory === iner?.name ? "bg-rose-600" : ""}`}
                        onClick={() => {
                          handleDropChange("innercategory", iner?._id)
                          handleBlogcat({ _id: iner?._id, name: iner?.name })
                        }
                        }
                      >
                        <span>{iner?.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="col-span-1 md:col-span-2">
                <JoditTextEditor value={state?.content} OnChangeEditor={(e: string) => handleDropChange("content", e)} />

              </div>
            </div>

            <div className="flex">
              <button className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb] disabled:bg-gray-500" type="submit" disabled={!state?.thumnail || !state?.title || !state?.content}>
                {isUpdate && !isError ? "Update" : "Submit"}
              </button>
              <button className="px-4 py-2 ml-8 text-white rounded-md bg-rose-600 hover:bg-rose-700" type="button" onClick={clearhandler}>Cancel</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CreatBlog;
