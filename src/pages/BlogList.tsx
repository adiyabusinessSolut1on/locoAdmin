import { Link, useNavigate } from "react-router-dom";
import { useDeletePostMutation, useGetDataQuery } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Loader from "../components/loader";
import Pagination from "../components/pagination/Pagination";
import { IoIosSend } from "react-icons/io";
import ConfirmDeleteModal from "../components/modal/DeleteModal";
import { BlogSTyepes } from "../types";
import { getMediaUrl } from "../utils/getMediaUrl";

const BlogList = () => {
  const navigate = useNavigate();
  const [deletPost] = useDeletePostMutation();
  const { data: response, isLoading, isError, } = useGetDataQuery({ url: "/blog/getallblogs" });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  //calculation of page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // const currentBlog = response?.data?.slice(indexOfFirstItem, indexOfLastItem);

  // Filter data based on search query
  const filteredData = response?.data?.filter((item: BlogSTyepes) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentBlog = filteredData?.slice(indexOfFirstItem, indexOfLastItem);


  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

  const deletblog = (id: string) => {
    console.log(id, "from handler");
    setModalOpen((prev) => ({
      ...prev,
      condition: !prev.condition,
      id: id,
    }));
  };
  const updateblog = (blog: BlogSTyepes) => {
    navigate(`/creat-blog/blogs-list/update-blog/${blog?._id}`);
  };

  const handleConfirmDelete = () => {
    toast.loading("checking Details");
    deletPost({
      url: `/blog/delete-blog/${isModalOpen.id}`,
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

  const blogHeadings = ["Image", "Title", "Date", "Setting"];
  return (
    <>
      {isLoading && <Loader />}
      <ToastContainer />
      {isModalOpen.condition && (
        <ConfirmDeleteModal onClose={handleCloseModal} onConfirm={handleConfirmDelete} />
      )}

      <section className={`  md:pl-0 p-4 h-full  w-full rounded-md   mx-auto [&::-webkit-scrollbar]:hidden `}>
        <section className={` md:p-8 p-6 h-full border-gray-200 rounded-md  max-w-full w-full `}>
          <div className="flex items-center mb-2 md:mb-6">
            <h1 className=" text-[28px] font-bold md:text-4xl text-gray-600 font-mavenPro">Blogs</h1>
          </div>
          <div className="flex justify-between mb-4">
            <div className={`flex items-center   `}>
              <input type="search" placeholder={`Search`} className={` p-2 text-sm md:text-base  sm:px-4 py-1 border-[2px] border-transparent bg-slate-50 focus:border-gray-100 shadow-inner rounded-[0.26rem] outline-none `} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setCurrentPage(1)} />
            </div>
            <div className="relative flex items-center self-end ">

              <button className={` px-2 py-1 bg-[#1f3c88] hover:bg-[#2d56bb]  text-[#DEE1E2] font-semibold} rounded shadow-xl md:px-4 md:py-2  sm:self-center`}>
                <Link to={"/creat-blog"}>
                  <span className="hidden md:inline-block">Add Blog</span>
                  <IoIosSend className="w-6 h-6 md:hidden" />
                </Link>
              </button>
            </div>
          </div>

          <section className={`w-full overflow-auto   border-2 [&::-webkit-scrollbar]:hidden rounded-lg border-gray-200 shadow-md bg-white`}>
            <section className="grid grid-cols-customBlog pb-2 p-2  gap-4   min-w-[900px] font-medium md:font-semibold bg-white font-mavenPro">
              <p className="pl-2 md:text-lg">SrNo.</p>

              {blogHeadings?.map((heading: string, index: number) => (
                <p key={index} className={`md:text-lg ${index !== 0 ? "justify-self-center" : "ml-10"}`}>{heading.charAt(0).toUpperCase() + heading.slice(1)}</p>
              ))}
            </section>
            <div className=" h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[900px] bg-gray-50">
              {isLoading ? (
                <p>Loading...</p>
              ) : isError ? (
                <p className="flex items-center justify-center w-full h-full font-medium text-center text-rose-800">Check Internet connection or Contact to Admin</p>
              ) : response?.data?.length > 0 ? (
                currentBlog?.map((blog: BlogSTyepes, i: number) => (
                  <section key={i} className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customBlog group hover:bg-gray-50">
                    <span>{i + 1}</span>
                    <div className="flex items-center justify-center">
                      {blog?.thumnail ? (
                        // <img src={`${import.meta.env.VITE_API_IMG_URL}/blog/${blog?.thumnail}`} alt="blog Image" className="object-contain w-full rounded-lg h-1/2" />
                        <img src={getMediaUrl(blog?.thumnail, "blog")} alt="blog Image" className="object-contain w-full rounded-lg h-1/2" />
                      ) : (
                        <span className="text-sm font-bold text-gray-400">No Image</span>
                      )}
                    </div>
                    <span className={`  font-semibold text-center  rounded-full  `}>{blog?.title}</span>

                    <span className="flex justify-center ml-2 text-sm font-semibold ">{blog?.createdAt ? new Date(blog?.createdAt).toLocaleDateString() : ""}</span>

                    <div className="grid justify-center gap-2">
                      <button className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb]" onClick={() => updateblog(blog)}>Edit</button>
                      <button className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-rose-600 hover:bg-rose-700" onClick={() => deletblog(blog._id)}>Delete</button>
                    </div>
                  </section>
                ))
              ) : (
                <div>Data Not Found</div>
              )}
            </div>
          </section>

          <Pagination<BlogSTyepes> currentPage={currentPage} apiData={filteredData} itemsPerPage={itemsPerPage} handleClick={handleClick} />
        </section>
      </section>
    </>
  );
};
export default BlogList;
