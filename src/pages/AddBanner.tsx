import { useEffect, useState } from "react";
import { useGetDataQuery, useUpdatePostMutation } from "../api";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import uploadFile from "../firebase_file/file";
import { TiArrowBackOutline } from "react-icons/ti";
import Loader from "../components/loader";
import { getMediaUrl } from "../utils/getMediaUrl";

interface Props {
    title: string;
    donwloadable: boolean;
    link: string;
    imageSrc: string;
}

const AddBanner = () => {
    const { id } = useParams();
    // const [createPost] = useCreatePostMutation();
    const [updatePost] = useUpdatePostMutation();
    const { data, isLoading, isError } = useGetDataQuery({
        url: `/banner/${id}`,
    });

    const [imagePreview, setImagePreview] = useState<string | any>()
    const [value, setValue] = useState<Props | any>({
        title: data?.data?.title || "",
        link: data?.data?.link || "",
        image: '',
    });

    const isUpdate = Object.keys(data || [])?.length !== 0;

    const OnchangeValue = (name: string, val: React.ReactNode) => {
        setValue((prev: any) => ({ ...prev, [name]: val }));
    };

    // const [progressStatus, setProgressStatus] = useState<number | null>(null);

    useEffect(() => {
        console.log("running");
        if (isUpdate && !isError) {
            setValue({
                link: data?.data?.link || "",
                title: data?.data?.title || "",
            });
            setImagePreview(getMediaUrl(data?.data?.image, "banner"))
        }
    }, [isUpdate, isError, data]);

    const hanhleFilecUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target?.files?.[0];
        if (selectedFile) {
            try {
                setImagePreview(URL.createObjectURL(selectedFile))
                setValue({ ...value, image: selectedFile, });
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Error uploading image");
            }
        }
    };

    const navigate = useNavigate();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.loading("Checking Details");
        try {
            const formData = new FormData()
            formData.append("title", value?.title)
            formData.append("image", value?.image)
            formData.append("link", value?.link)


            const response = await updatePost({
                data: formData,
                method: isUpdate && !isError ? "PUT" : "POST",
                path: isUpdate && !isError ? `/banner/${id}` : `/banner/add`,
            }).unwrap()

            if (response?.success) {
                toast.dismiss();
                toast.success(response.message);

                clearhandler();
            } else {
                toast.dismiss();
                toast.error("Failed to create Sub sub-category");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("An error occurred");
        }
    };

    const clearhandler = () => {
        setValue({
            title: "",
            link: "",
            image: "",
        });

        navigate("/banner");
    };

    // console.log(value, id, data, isUpdate ? "Put" : "Post");

    return (
        <div className="w-full md:px-4 md:ml-4 md:pl-0">
            {/* <ToastContainer /> */}
            {isLoading && <Loader />}
            <form className="w-full h-[calc(100vh-6rem)] overflow-hidden   rounded-md" onSubmit={handleCreate}>
                <div className="flex-1 h-full p-6 rounded font-montserrat">
                    <div className="flex pb-2">
                        <h2 className="md:text-4xl text-[28px] font-bold text-gray-500 font-mavenPro">Creat Banner</h2>
                        <div onClick={clearhandler}>
                            <TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" />
                        </div>
                    </div>

                    <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
                        <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
                            <input value={value?.title} onChange={(e) => OnchangeValue("title", e.target.value)} type="text" placeholder="Enter Title" className="w-full h-10 pl-4 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 " required />
                            <input value={value?.link} onChange={(e) => OnchangeValue("link", e.target.value)} type="text" placeholder="Enter link" className="w-full h-10 pl-4 font-medium text-gray-700 bg-blue-100 border border-transparent rounded-md outline-none focus:border-blue-200 " />

                            <div className="relative w-full h-full">
                                <input type="file" name="image" onChange={hanhleFilecUpload} className="hidden" id="file-upload" />
                                {/* <label htmlFor="file-upload" className={`px-4 py-2 pl-24 relative ${progressStatus ? "pb-2" : ""} w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}> */}
                                <label htmlFor="file-upload" className={`px-4 py-2 pl-24 relative w-full text-base bg-blue-100 focus:border-blue-200 border-transparent border rounded-md text-gray-400 cursor-pointer flex items-center justify-between`}>
                                    {imagePreview ? <img src={imagePreview} alt="user Image" className="object-cover w-48 h-24 " />
                                        :
                                        <>
                                            <p className={`font-medium `}>Choose a file</p>
                                            <span className="text-gray-400 text-[15px] absolute top-0 h-full flex items-center left-0 rounded-tl-md rounded-bl-md px-3 font-medium bg-blue-200">Browse</span>
                                        </>
                                    }
                                </label>
                            </div>

                        </div>

                        <div className="flex">
                            <button className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb] disabled:bg-gray-700 " type="submit" /* disabled={!value?.link || !value?.image || !value?.title} */>
                                {isUpdate ? "Update" : "Submit"}
                                {/* Save */}
                            </button>
                            <button className="px-4 py-2 ml-8 text-white rounded-md bg-rose-600 hover:bg-rose-700" type="button" onClick={clearhandler}>Cancel</button>
                        </div>
                    </div>
                </div>
            </form >
        </div >
    );
};

export default AddBanner;
