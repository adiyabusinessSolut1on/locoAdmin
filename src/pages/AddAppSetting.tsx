import React, { useEffect, useState } from 'react'
import { TiArrowBackOutline } from 'react-icons/ti'
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'
import { useGetDataQuery, useUpdatePostMutation } from '../api';
import axios from 'axios';
import Loader from '../components/loader';

function AddAppSetting() {
    const { id } = useParams();
    const navigate = useNavigate();
    const basUrl = import.meta.env.VITE_API_BASE_URL
    // const token = localStorage.getItem("user");

    const [updatePost] = useUpdatePostMutation();


    /* const { data: updateAwar, isError: isErrorAwar } = useGetDataQuery({
        url: `/setting/${id}`,
    }); */

    // console.log("data: ", updateAwar);


    // const isUpdate = Object.keys(updateAwar || [])?.length !== 0;
    const [loading, setLoading] = useState(false)

    const [setting, setSetting] = useState({
        versionCode: '',
        versionName: '',
        comment: '',
        url: '',
        appName: ''
    })
    // console.log("update: ", updateAwar.data);

    const getSingleProduct = async () => {
        setLoading(true)
        return await axios.get(`${basUrl}/setting/${id}`).then((response) => {

            setSetting(response.data?.data)
            setLoading(false)
        }).catch((error: any) => {
            toast.error("Failed to get App Setting")
            setLoading(false)
        })
    }


    useEffect(() => {

        if (id) {
            getSingleProduct()
        }
    }, [id, loading]);


    const handleChange = (evt: any) => {
        setSetting({ ...setting, [evt.target.name]: evt.target.value })
    };

    const handleSubmit = async (evt: any) => {
        evt.preventDefault();

        toast.loading("Checking Details");
        try {
            toast.loading("Checking Details");

            const response = await updatePost({
                data: setting,
                method: id ? "PUT" : "POST",
                path: id ? `/setting/update/${id}` : "/setting/add",
            });

            console.log(response);

            if (response?.data?.success) {
                toast.dismiss();
                toast.success(response?.data?.message, { autoClose: 5000, });
                clearhandler();
            } else {
                toast.dismiss();
                toast.error(`Failed to ${id ? "Update Blog" : "Create Blog"} create Blog`);
            }
        } catch (error) {
            toast.dismiss();
            console.error(`Error ${id ? "Updating Blog" : "Creating Blog"} :`, error);
            toast.error("An error occurred");
        }
    }

    const clearhandler = () => {
        navigate(-1)
    }
    return (
        <div className="w-full md:px-4 md:ml-4 md:pl-0">
            {loading && <Loader />}
            <ToastContainer />
            <form className="w-full h-[calc(100vh-6rem)] overflow-hidden   rounded-md" onSubmit={handleSubmit}>
                <div className="flex-1 h-full p-6 rounded font-montserrat">
                    <div className="flex pb-2">
                        <h2 className="md:text-4xl text-[28px] font-bold text-gray-500 font-mavenPro">{`${id ? "Update" : "Creat"} App Setting`}</h2>
                        <div onClick={clearhandler}>
                            <TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" />
                        </div>
                    </div>
                    <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
                        <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
                            <input value={setting.appName} onChange={handleChange} name="appName" type="text" placeholder="Enter App Name"
                                className="w-full h-10 pl-4 font-medium text-gray-700 bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                                required
                            />
                            <input value={setting.versionName} onChange={handleChange} name="versionName" type="number" placeholder="Enter Version Name"
                                className="w-full h-10 pl-4 font-medium text-gray-700 bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                                required
                            />
                            <input value={setting.versionCode} onChange={handleChange} name="versionCode" type="number" placeholder="Enter Version Code"
                                className="w-full h-10 pl-4 font-medium text-gray-700 bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                                required
                            />
                            <input value={setting.url} onChange={handleChange} name="url" type="text" placeholder="Enter url"
                                className="w-full h-10 pl-4 font-medium text-gray-700 bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                                required
                            />
                            <input value={setting.comment} onChange={handleChange} name="comment" type="text" placeholder="Enter comment"
                                className="w-full h-10 pl-4 font-medium text-gray-700 bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                            />
                        </div>





                        <div className="flex">
                            <button className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb] disabled:bg-gray-400" type="submit" disabled={!setting?.appName || !setting?.versionName || !setting?.versionCode || !setting?.url}>{id ? "Update" : "Submit"}</button>
                            <button className="px-4 py-2 ml-8 text-white rounded-md bg-rose-600 hover:bg-rose-700" type="button" onClick={clearhandler}>Cancel</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddAppSetting