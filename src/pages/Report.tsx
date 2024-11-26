import React, { useState } from 'react';
import Pagination from '../components/pagination/Pagination';
import Loader from '../components/loader';
import { useGetDataQuery } from '../api';

function Report() {
    const { data: response, isLoading, isError } = useGetDataQuery({ url: "/report" });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const [searchQuery, setSearchQuery] = useState("");

    // console.log("response: ", response);


    // Filter blogs based on the search query
    const filteredBlogs = response?.filter((blog: any) =>
        blog?.reportedBy?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );


    // Calculation for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBlogs = filteredBlogs?.slice(indexOfFirstItem, indexOfLastItem);

    const handleClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const blogHeadings = ["Reported By", "Reported User", "Report Post", "Reported Date"];

    return (
        <>
            {isLoading && <Loader />}

            <section className="md:pl-0 p-4 h-full w-full rounded-md mx-auto [&::-webkit-scrollbar]:hidden">
                <section className="md:p-8 p-6 h-full border-gray-200 rounded-md max-w-full w-full">
                    <div className="flex items-center mb-2 md:mb-6">
                        <h1 className="text-[28px] font-bold md:text-4xl text-gray-600 font-mavenPro">Reports</h1>
                    </div>
                    <div className="flex justify-between mb-4">
                        <div className="flex items-center">
                            <input type="search" placeholder="Search" className="p-2 text-sm md:text-base sm:px-4 py-1 border-[2px] border-transparent bg-slate-50 focus:border-gray-100 shadow-inner rounded-[0.26rem] outline-none" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
                        </div>
                    </div>
                    <section className="w-full overflow-auto border-2 [&::-webkit-scrollbar]:hidden rounded-lg border-gray-200 shadow-md bg-white">
                        <section className="grid grid-cols-customBlog pb-2 p-2 gap-4 min-w-[900px] font-medium md:font-semibold bg-white font-mavenPro">
                            <p className="pl-2 md:text-lg">SrNo.</p>
                            {blogHeadings?.map((heading, index) => (
                                <p key={index} className={`md:text-lg ${index !== 0 ? "justify-self-center" : "ml-10"}`}>{heading.charAt(0).toUpperCase() + heading.slice(1)}</p>
                            ))}
                        </section>
                        <div className="h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[900px] bg-gray-50">
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : isError ? (
                                <p className="flex items-center justify-center w-full h-full font-medium text-center text-rose-800">
                                    Check Internet connection or Contact Admin
                                </p>
                            ) : currentBlogs?.length > 0 ? (currentBlogs?.map((blog: any, i: number) => (
                                <section key={i} className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customBlog group hover:bg-gray-50">
                                    <span>{indexOfFirstItem + i + 1}</span>
                                    <div className="flex items-center justify-center">{blog?.reportedBy?.name}</div>
                                    <span className="font-semibold text-center rounded-full">{blog?.reportedUser?.name}</span>
                                    <span className="font-semibold text-center rounded-full">{blog?.reportedPost?._id}</span>
                                    <span className="flex justify-center ml-2 text-sm font-semibold">
                                        {blog?.createdAt ? new Date(blog?.createdAt).toLocaleDateString() : ""}
                                    </span>
                                </section>
                            ))
                            ) : (
                                <div className="text-center p-4">No Report Found</div>
                            )}
                        </div>
                    </section>

                    {/* Pagination */}
                    <Pagination currentPage={currentPage} apiData={filteredBlogs} itemsPerPage={itemsPerPage} handleClick={handleClick} />
                </section>
            </section>
        </>
    );
}

export default Report;
