import React, { Fragment, useEffect, useState } from 'react'
import { IoIosSend } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { useDeletePostMutation, useGetDataQuery } from '../api';
import axios from 'axios';
import ConfirmDeleteModal from '../components/modal/DeleteModal';
import Loader from '../components/loader';

function UpdateSetting() {
    const basUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem("user");
    const [deletPost] = useDeletePostMutation();
    // const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const { data, isLoading, isError } = useGetDataQuery({ url: "/setting" });


    // const [isError, setIsError] = useState(false)

    // const [data, setData] = useState([])

    const [isModalOpen, setModalOpen] = useState({
        condition: false,
        id: "",
    });

    /* const getAllSetting = async () => {
        return await axios.get(`${basUrl}/setting`).then((response: any) => {
            setData(response.data)
            setIsLoading(false)
        }).catch((error: any) => {
            setIsError(true)
            toast.error("Failed to get App Setting")
            setIsLoading(false)
        })
    } */

    useEffect(() => {
        // getAllSetting()
    }, [isLoading])

    const blogHeadings = ["appName", "Version Code", "Version Name", "comment", "url", "Created At", "Action"];

    const updateblog = (id: string) => {
        navigate(`/update/${id}`);
    };


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

    const handleConfirmDelete = () => {
        // Handle the delete action here
        toast.loading("checking Details");
        // console.log("Item deleted", isModalOpen.id);
        deletPost({ url: `/setting/delete/${isModalOpen.id}`, }).then((res) => {
            if (res.data.success) {
                toast.dismiss();
                toast.success(`${res.data.message}`);
            }
            console.log(res);
        }).catch(() => {
            toast.dismiss();
            toast.error("Not successfull to delete");
        });
        setModalOpen({
            condition: false,
            id: "",
        });
    };


    /* data?.data?.map((item, ind) => {
        console.log("item: ", item);

    }) */
    return (
        <Fragment>
            {isLoading && <Loader />}
            <ToastContainer />
            {isModalOpen.condition && (
                <ConfirmDeleteModal
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
                />
            )}

            <section className={`md:pl-0 p-4 h-full w-full rounded-md   mx-auto [&::-webkit-scrollbar]:hidden `}>

                <section className={` md:p-8 p-6 h-full text-gray-600 border-gray-200 rounded-md max-w-full w-full`}>
                    <div className="flex items-center mb-2 md:mb-6">
                        <h1 className=" text-[28px] font-bold md:text-4xl font-mavenPro ">App Setting</h1>
                    </div>
                    <div className="flex justify-between mb-4">
                        <div className="flex items-center">

                        </div>
                        <div className="relative flex items-center self-end">
                            <button className="px-2 py-1 bg-[#1f3c88] hover:bg-[#2d56bb] text-[#DEE1E2] font-semibold rounded shadow-xl md:px-4 md:py-2 sm:self-center">
                                <Link to={"/add-update"}>
                                    <span className="hidden md:inline-block">Add Setting</span>
                                    <IoIosSend className="w-6 h-6 md:hidden" />
                                </Link>
                            </button>
                        </div>
                    </div>


                    <section className="w-full overflow-auto border-2 [&::-webkit-scrollbar]:hidden rounded-lg border-gray-200 shadow-md bg-white">
                        <section className="grid grid-cols-customSetting pb-2 p-2 gap-4 min-w-[900px] font-medium md:font-semibold bg-white font-mavenPro">
                            <p className="pl-2 md:text-lg">SrNo.</p>
                            {blogHeadings?.map((heading, index) => (
                                <p key={index} className={`md:text-lg ${index !== 0 ? "justify-self-center" : "ml-10"}`}>
                                    {heading.charAt(0).toUpperCase() + heading.slice(1)}
                                </p>
                            ))}
                        </section>
                        <div className="h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden min-w-[900px] bg-gray-50">
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : isError ? (
                                <p className="flex items-center justify-center w-full h-full font-medium text-center text-rose-800">
                                    Check Internet connection or Contact Admin
                                </p>
                            ) : data?.data?.length > 0 ? (
                                data?.data?.map((blog, i: number) => (
                                    <section key={i} className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customSetting group hover:bg-gray-50">
                                        <span>{i + 1}</span>

                                        <span className="font-semibold text-center rounded-full">{blog?.appName}</span>
                                        <span className="font-semibold text-center rounded-full">{blog?.versionCode}</span>

                                        <span className="font-semibold text-center rounded-full">{blog?.versionName}</span>

                                        <span className="font-semibold text-center rounded-full">{blog?.comment}</span>
                                        <span className="font-semibold text-center rounded-full">{blog?.url}</span>

                                        <span className="flex justify-center ml-2 text-sm font-semibold">{blog?.createdAt ? new Date(blog?.createdAt).toLocaleDateString() : ""}</span>
                                        <div className="grid justify-center gap-2">
                                            <button className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb]"
                                                onClick={() => updateblog(blog?._id)}
                                            >
                                                Edit
                                            </button>
                                            <button className="px-3 py-2 text-sm font-semibold text-white rounded-md bg-rose-600 hover:bg-rose-700"
                                                onClick={() => deletblog(blog._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </section>
                                ))
                            ) : (
                                <div>No App Setting Found</div>
                            )}
                        </div>
                    </section>
                </section>

            </section>
        </Fragment>
    )
}

export default UpdateSetting