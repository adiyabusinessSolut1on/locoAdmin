import { useState } from "react";
import Pagination from "../components/pagination/Pagination";
import { useGetDataQuery } from "../api";
import {
  BlogDataType,
  BlogDataTypes,
  DataType,
  GroupedDataType,
  MutaulDataType,
  MutualPostDataTypes,
  PostDataType,
  PostDataTypes,
} from "../types";
import Loader from "../components/loader";

const Dashboard = () => {
  const mutualPostHeading = ["Mut.Post", "Date"];

  const [currentPage, setCurrentPage] = useState({
    mutual: 1,
    blog: 1,
    post: 1,
  });

  const {
    data: mutulapost,
    isLoading: mutulLoading,
    isError: mutualIsError,
    // error: mutualerror,
  } = useGetDataQuery({
    url: "/mutual/post",
  });
  const {
    data: post,
    isLoading: postLoading,
    isError: postisError,
    // error: posterror,
  } = useGetDataQuery({
    url: "/posts",
  });
  const {
    data: blog,
    isLoading: blogLoading,
    isError: blogError,
    // error: blogerror,
  } = useGetDataQuery({
    url: "/blog/getallblogs",
  });

  //   console.log(mutulapost, mutualIsError, mutualerror, "Mutual blog");
  //   console.log(post, postisError, posterror, "Post blog");
  //   console.log(blog, blogError, blogerror, "Blog blog");

  const handleClick = (name: string, pageNumber: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [name]: pageNumber,
    }));
  };

  const postHeading = ["Post", "Likes", "Comments", "Date"];

  const blogHeading = ["Blog", "Comments", "Date"];

  const groupByDate = (
    data: DataType[] | undefined
  ): Record<string, GroupedDataType> => {
    if (!data) {
      return {}; // Return an empty object if data is undefined
    }
    return data?.reduce((groups, item) => {
      const date = item?.createdAt.split("T")[0];

      if (!groups[date]) {
        groups[date] = { post: [], likes: 0, comments: 0 };
      }
      groups[date].post.push(item);

      if ("like" in item && "comments" in item) {
        groups[date].likes += item?.like || 0;
        groups[date].comments += item?.comments?.length || 0;
      }
      return groups;
    }, {} as Record<string, GroupedDataType>);
  };

  const itemsPerPage = 10;

  //mutual post
  const groupMutualData = groupByDate(mutulapost);

  const formateMutualData = Object?.keys(groupMutualData ?? [])?.map(
    (date) => ({
      date,
      mutualPost: groupMutualData[date].post as MutaulDataType[],
    })
  );

  //calculation of page
  const indexOfLastItemMutual = currentPage.mutual * itemsPerPage;
  const indexOfFirstItemMutual = indexOfLastItemMutual - itemsPerPage;
  const currentMutualPost = formateMutualData?.slice(
    indexOfFirstItemMutual,
    indexOfLastItemMutual
  );

  //post
  const groupPostData = groupByDate(post);
  const formatePostData = Object?.keys(groupPostData ?? [])?.map((date) => ({
    date,
    post: groupPostData[date].post as PostDataType[],
    likes: groupPostData[date].likes,
    comments: groupPostData[date].comments,
  }));

  //calculation of page
  const indexOfLastItemPost = currentPage.post * itemsPerPage;
  const indexOfFirstItemPost = indexOfLastItemPost - itemsPerPage;
  const currentPostData = formatePostData?.slice(
    indexOfFirstItemPost,
    indexOfLastItemPost
  );

  //blog
  const groupedData = groupByDate(blog?.data);

  // Transform the grouped data into the desired format
  const formattedData = Object?.keys(groupedData ?? [])?.map((date) => ({
    date,
    blog: groupedData[date].post as BlogDataType[],
    comments: groupedData[date].comments,
  }));

  //calculation of page
  const indexOfLastItemBlog = currentPage.blog * itemsPerPage;
  const indexOfFirstItemBlog = indexOfLastItemBlog - itemsPerPage;
  const currentBlogData = formattedData?.slice(
    indexOfFirstItemBlog,
    indexOfLastItemBlog
  );

  console.log(formattedData, groupedData, "update blog");
  console.log(formatePostData, groupPostData, "update post");
  return (
    <>
      {mutulLoading && postLoading && blogLoading && <Loader />}

      <section
        className={`  md:pl-0 p-4 h-full w-full rounded-md   mx-auto [&::-webkit-scrollbar]:hidden `}
      >
        <section
          className={` md:p-8 p-6 h-full  text-gray-600  border-gray-200 
                  rounded-md   max-w-full w-full `}
        >
          <div className="flex items-center mb-2 md:mb-6">
            <h1 className=" text-[28px] font-bold md:text-4xl font-mavenPro ">
              Post All Details
            </h1>
          </div>

          <section className="grid grid-cols-1 gap-6 pb-4 md:grid-cols-2">
            <section>
              <div className="flex items-center mb-2 md:mb-6">
                <h1 className=" text-[24px] font-bold md:text-3xl font-mavenPro ">
                  Mutual Posts
                </h1>
              </div>
              <section
                className={`w-full overflow-auto   border-2 [&::-webkit-scrollbar]:hidden rounded-lg  shadow-md bg-white`}
              >
                {/* min-w-[900px] */}
                <section className="grid gap-4 p-2 pb-2 min-w-[600px] font-medium border-gray-100 grid-cols-customAllPost md:font-semibold font-mavenPro bg-white">
                  <p className="pl-2 text-gray-600 md:text-lg">SrNo.</p>
                  {/* <p className="pl-10 text-gray-600 md:text-lg">Logo</p> */}

                  {mutualPostHeading?.map((heading: string, index: number) => (
                    <p
                      key={index}
                      className={`  text-gray-600 md:text-lg  ${
                        index !== 0 ? "justify-self-center" : "ml-24"
                      }`}
                    >
                      {heading.charAt(0).toUpperCase() + heading.slice(1)}
                    </p>
                  ))}
                </section>
                {/* min-w-[900px] */}
                <div className=" h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[600px] bg-gray-50">
                  {mutualIsError ? (
                    <p className="flex items-center justify-center w-full h-full font-bold text-gray-600">
                      Contact to admin
                    </p>
                  ) : (
                    currentMutualPost?.map(
                      (detail: MutualPostDataTypes, i: number) => (
                        <section
                          key={i}
                          className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customAllPost group hover:bg-gray-50"
                        >
                          <span>{i + 1}</span>

                          <span
                            className={`  gap-4 transition-all duration-500 text-sm font-semibold text-center text-gray-600 cursor-pointer md:text-base`}
                          >
                            {detail?.mutualPost.length}
                          </span>

                          <span className="ml-2 text-sm font-semibold text-center text-gray-600 md:text-base">
                            {detail?.date}
                          </span>
                        </section>
                      )
                    )
                  )}
                </div>
              </section>
              <Pagination<MutualPostDataTypes>
                currentPage={currentPage.mutual}
                apiData={formateMutualData}
                itemsPerPage={itemsPerPage}
                handleClick={(count) => handleClick("mutual", count)}
              />
            </section>
            <section>
              <div className="flex items-center mb-2 md:mb-6">
                <h1 className=" text-[24px] font-bold md:text-3xl font-mavenPro ">
                  Posts
                </h1>
              </div>
              <section
                className={`w-full overflow-auto   border-2 [&::-webkit-scrollbar]:hidden rounded-lg  shadow-md bg-white`}
              >
                {/* min-w-[900px] */}
                <section className="grid gap-4 p-2 pb-2 min-w-[600px] font-medium border-gray-100 grid-cols-customPost md:font-semibold font-mavenPro bg-white">
                  <p className="pl-2 text-gray-600 md:text-lg">SrNo.</p>
                  {/* <p className="pl-10 text-gray-600 md:text-lg">Logo</p> */}

                  {postHeading?.map((heading: string, index: number) => (
                    <p
                      key={index}
                      className={`  text-gray-600 md:text-lg  ${
                        index !== 0 ? "justify-self-center" : "ml-20"
                      }`}
                    >
                      {heading.charAt(0).toUpperCase() + heading.slice(1)}
                    </p>
                  ))}
                </section>

                <div className=" h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[600px] bg-gray-50">
                  {postisError ? (
                    <p className="flex items-center justify-center w-full h-full font-bold text-gray-600">
                      Contact to admin
                    </p>
                  ) : (
                    currentPostData?.map((detail: PostDataTypes, i: number) => (
                      <section
                        key={i}
                        className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customPost group hover:bg-gray-50"
                      >
                        <span>{i + 1}</span>

                        {/* <span className="text-sm font-semibold text-center text-gray-600 md:text-base">
                      {detail?.post?.length}
                    </span> */}

                        <span
                          className={`flex justify-start ml-16 gap-4 transition-all duration-500 text-sm font-semibold text-center text-gray-600 cursor-pointer md:text-base`}
                          //   onMouseEnter={() => handleEnter("blog", i)}
                          //   onMouseLeave={() => handleLeave("blog")}
                        >
                          {/* {isvisible.blog === i && ( */}
                          {detail?.post?.length}
                          {/* )} */}
                        </span>
                        <span className="ml-4 text-blue-400">
                          {`Like: ${detail.likes} `}
                        </span>
                        <span className="text-blue-400">
                          {` Comments:${detail.comments}`}
                        </span>

                        <span className="ml-2 text-sm font-semibold text-center text-gray-600 md:text-base">
                          {detail?.date}
                        </span>
                      </section>
                    ))
                  )}
                </div>
              </section>
              <Pagination<PostDataTypes>
                currentPage={currentPage.post}
                apiData={formatePostData}
                itemsPerPage={itemsPerPage}
                handleClick={(count) => handleClick("post", count)}
              />
            </section>
            <section>
              <div className="flex items-center mb-2 md:mb-6">
                <h1 className=" text-[24px] font-bold md:text-3xl font-mavenPro ">
                  Blogs
                </h1>
              </div>
              <section
                className={`w-full overflow-auto   border-2 [&::-webkit-scrollbar]:hidden rounded-lg  shadow-md bg-white`}
              >
                {/* min-w-[900px] */}
                <section className="grid gap-4 p-2 pb-2 min-w-[600px] font-medium border-gray-100 grid-cols-customBlog md:font-semibold font-mavenPro bg-white">
                  <p className="pl-2 text-gray-600 md:text-lg">SrNo.</p>
                  {/* <p className="pl-10 text-gray-600 md:text-lg">Logo</p> */}

                  {blogHeading?.map((heading: string, index: number) => (
                    <p
                      key={index}
                      className={`  text-gray-600 md:text-lg  ${
                        index !== 0 ? "justify-self-center" : "ml-20"
                      }`}
                    >
                      {heading.charAt(0).toUpperCase() + heading.slice(1)}
                    </p>
                  ))}
                </section>
                {/* min-w-[900px] */}
                <div className=" h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[600px] bg-gray-50">
                  {blogError ? (
                    <p className="flex items-center justify-center w-full h-full font-bold text-gray-600">
                      Contact to admin
                    </p>
                  ) : (
                    currentBlogData?.map((detail: BlogDataTypes, i: number) => (
                      <section
                        key={i}
                        className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customBlog group hover:bg-gray-50"
                      >
                        <span>{i + 1}</span>

                        <span
                          className={`flex justify-center  gap-4 transition-all duration-500 text-sm font-semibold text-center text-gray-600 cursor-pointer md:text-base`}
                        >
                          {detail?.blog?.length}
                        </span>
                        <span className="ml-6 text-blue-400">
                          {` Comments:${detail.comments}`}
                        </span>
                        <span className="ml-2 text-sm font-semibold text-center text-gray-600 md:text-base">
                          {detail?.date}
                        </span>
                      </section>
                    ))
                  )}
                </div>
              </section>
              <Pagination<BlogDataTypes>
                currentPage={currentPage.blog}
                apiData={formattedData}
                itemsPerPage={itemsPerPage}
                handleClick={(count) => handleClick("blog", count)}
              />
            </section>
          </section>
        </section>
      </section>
    </>
  );
};

export default Dashboard;
