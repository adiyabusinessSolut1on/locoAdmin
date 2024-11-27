import { ChangeEvent, useEffect, useState } from "react";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaCaretDown } from "react-icons/fa";
// import { awarenessCategoryType } from "../types";
import { TiArrowBackOutline } from "react-icons/ti";

/* interface StateProps {
    category: CategoryType;
    title: string;

    thumnail: string;
    imageSrc: string;
    content: string;
} */

/* interface CategoryType {
    id: string;
    name: string;
} */

type awarenessCategoryType = {
    _id: string;
    title: string;
};

function AddDailyTask() {
    const navigate = useNavigate();
    const [updatePost] = useUpdatePostMutation();

    const { id } = useParams();
    const { data: updateAwar, isError: isErrorAwar } = useGetDataQuery({
        url: `/daily-task/${id}`,
    });


    // console.log("updateAwar: ", updateAwar);


    const isUpdate = Object.keys(updateAwar || [])?.length !== 0;

    const { data: awareness } = useGetDataQuery({
        url: "/awareness",
    });
    const { data: blogs } = useGetDataQuery({
        url: "/blog/getallblogs",
    });
    const { data: videos } = useGetDataQuery({
        url: "/video/get-all-video",
    });
    const { data: quiz } = useGetDataQuery({
        url: "/quiz",
    });
    const { data: test } = useGetDataQuery({
        url: "/test",
    });


    const [dailyTask, setDailyTask] = useState<any>({
        title: "",
        content: "",
    })



    // selsection fileds
    const [selectAwareness, setSelectAwareness] = useState<any>()
    const [selectBlog, setSelectBlog] = useState<any>()
    const [selectVideo, setSelectVideo] = useState<any>()
    const [selectQuiz, setSelectQuiz] = useState<any>()
    const [selectTest, setSelectTest] = useState<any>()

    // awarnacess tag
    const [awarenessTag, setAwarenessTag] = useState([])
    const [blogTag, setBlogTag] = useState([])
    const [videoTag, setVideoTag] = useState([])
    const [quizTag, setQuizTag] = useState([])
    const [testTag, setTestTag] = useState([])


    // open dropdown
    const [openAwareness, setOpenAwareness] = useState(false)
    const [openBlog, setOpenBlog] = useState(false)
    const [openVideo, setOpenVideo] = useState(false)
    const [openQuiz, setOpenQuiz] = useState(false)
    const [openTest, setOpenTest] = useState(false)




    useEffect(() => {
        if (isUpdate) {
            setDailyTask({ title: updateAwar?.title, content: updateAwar?.content })

            setAwarenessTag(updateAwar.awareness || []);
            setBlogTag(updateAwar.blog || []);
            setVideoTag(updateAwar.video || []);
            setQuizTag(updateAwar.quiz || []);
            setTestTag(updateAwar.test || []);

        }
    }, [isUpdate, isErrorAwar, updateAwar]);



    const handleOnChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setDailyTask({ ...dailyTask, [evt.target.name]: evt.target.value })
    }


    // handle onchagne for the dropdown
    const handleAwarenessChange = (result: awarenessCategoryType) => {
        setSelectAwareness({ title: result?.title, _id: result?._id });

        // Add to awarenessTag if not already present
        setAwarenessTag((prev: any) => {
            if (prev.some((item: any) => item._id === result._id)) return prev; // Avoid duplicates
            return [...prev, result];
        });

        setOpenAwareness(false);
    };

    const handleBlogChange = (result: awarenessCategoryType) => {
        setSelectBlog({ title: result?.title, _id: result?._id });

        // Add to awarenessTag if not already present
        setBlogTag((prev: any) => {
            if (prev.some((item: any) => item._id === result._id)) return prev; // Avoid duplicates
            return [...prev, result];
        });

        setOpenBlog(false);
    };

    const handleVidoeChange = (result: awarenessCategoryType) => {
        setSelectVideo({ title: result?.title, _id: result?._id });

        // Add to awarenessTag if not already present
        setVideoTag((prev: any) => {
            if (prev.some((item: String | any) => item._id === result._id)) return prev; // Avoid duplicates
            return [...prev, result];
        });

        setOpenVideo(false);
    };
    const handleQuizChange = (result: awarenessCategoryType) => {
        setSelectQuiz({ title: result?.title, _id: result?._id });

        // Add to awarenessTag if not already present
        setQuizTag((prev: any) => {
            if (prev.some((item: String | any) => item._id === result._id)) return prev; // Avoid duplicates
            return [...prev, result];
        });

        setOpenQuiz(false);
    };
    const handleTestChange = (result: awarenessCategoryType) => {
        setSelectTest({ title: result?.title, _id: result?._id });

        // Add to awarenessTag if not already present
        setTestTag((prev: any) => {
            if (prev.some((item: String | any) => item._id === result._id)) return prev; // Avoid duplicates
            return [...prev, result];
        });

        setOpenTest(false);
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.loading("Checking Details");
        try {
            const payload = {
                dailyTask: dailyTask,
                awarenessTag: awarenessTag,
                blogTag: blogTag,
                videoTag: videoTag,
                quizTag: quizTag,
                testTag: testTag,
            };

            console.log(payload, "submit");
            const response = await updatePost({
                data: payload, method: isUpdate && !isErrorAwar ? "PUT" : "POST",
                path: isUpdate && !isErrorAwar ? `/daily-task/${id}` : "/daily-task",
            });

            if (response?.data?.success) {
                toast.dismiss();
                toast.success(response?.data?.message, { autoClose: 5000, });
                navigate("/daily-task");
            } else {
                toast.dismiss();
                toast.error("Failed to create main category");
            }
        } catch (error) {
            toast.dismiss();
            console.error("Error creating main category:", error);
            toast.error("An error occurred");
        }
    };

    const clearhandler = () => {
        setDailyTask({})
        setAwarenessTag([])
        setBlogTag([])
        setVideoTag([])
        setQuizTag([])
        setTestTag([])

        setSelectAwareness({})
        setSelectBlog({})
        setSelectVideo({})
        setSelectQuiz({})
        setSelectTest({})


        navigate("/daily-task");
    };


    return (
        <div className="w-full md:px-4 md:ml-4 md:pl-0">
            <ToastContainer />
            <form className="w-full h-[calc(100vh-6rem)] overflow-hidden   rounded-md" onSubmit={handleSubmit}>
                <div className="flex-1 h-full p-6 rounded font-montserrat">

                    <div className="flex pb-2">
                        <h2 className="md:text-4xl text-[28px] font-bold text-gray-500 font-mavenPro">{`${isUpdate ? "Update" : "Create"} Daily Form`}</h2>
                        <div onClick={clearhandler}>
                            <TiArrowBackOutline className="w-10 h-10 ml-4 text-emerald-600 hover:text-emerald-500" />
                        </div>
                    </div>

                    <div className="h-[calc(100vh-12rem)] w-full overflow-y-auto  [&::-webkit-scrollbar]:hidden font-mavenPro">
                        <div className="grid items-center grid-cols-1 gap-4 py-4 md:grid-cols-2">
                            <input value={dailyTask?.title} onChange={handleOnChange} type="text" name="title" placeholder="Enter Title" required
                                className="w-full h-10 pl-4 font-medium text-gray-700 bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                            />

                            <div className="relative w-full h-full">
                                <input value={dailyTask?.content} onChange={handleOnChange} type="text" name="content" placeholder="Enter Content"
                                    className="w-full h-10 pl-4 font-medium text-gray-700 bg-green-100 border border-transparent rounded-md outline-none focus:border-blue-200 "
                                />
                            </div>


                            {/* Awareness Dropdown */}
                            {awareness?.length > 0 &&
                                <>
                                    <div className="relative">
                                        <div onClick={() => setOpenAwareness(!openAwareness)} className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-green-100 border-transparent rounded-md cursor-pointer focus:border-blue-200">
                                            <span className={`font-medium ${selectAwareness?.title ? 'text-gray-700' : 'text-gray-400'}`}>
                                                {selectAwareness?.title ? selectAwareness?.title : 'Select Awareness'}
                                            </span>

                                            <FaCaretDown className="m-1" />
                                        </div>

                                        <ul className={`mt-2 p-2 rounded-md w-32 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${openAwareness ? 'max-h-60' : 'hidden'} custom-scrollbar`}>
                                            {awareness?.map((category: awarenessCategoryType, i: number) => (
                                                <li key={i} className={`p-2 ${awareness.length > 1 ? 'mb-2' : ''} text-sm font-medium rounded-md cursor-pointer flex items-center gap-2 hover:bg-blue-200/60 ${selectAwareness?.title === category?.title ? 'bg-rose-600' : ''}`} onClick={() => handleAwarenessChange({ title: category?.title, _id: category?._id })}>
                                                    {category?.title}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Selected Awareness Tags */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {awarenessTag.map((tag: any) => (
                                            <div key={tag._id} className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-md flex items-center gap-2">
                                                {tag.title}
                                                <button onClick={() => setAwarenessTag((prev: any) => prev.filter((item: any) => item._id !== tag._id))} className="text-red-500 hover:text-red-700">
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            }


                            {/* Blog Dropdown */}
                            {blogs?.data?.length > 0 &&
                                <>
                                    <div className="relative">
                                        <div onClick={() => setOpenBlog(!openBlog)} className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-green-100 border-transparent rounded-md cursor-pointer focus:border-blue-200">
                                            <span className={`font-medium ${selectBlog?.title ? 'text-gray-700' : 'text-gray-400'}`}>
                                                {selectBlog?.title ? selectBlog?.title : 'Select Blog'}
                                            </span>

                                            <FaCaretDown className="m-1" />
                                        </div>

                                        <ul className={`mt-2 p-2 rounded-md w-32 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${openBlog ? 'max-h-60' : 'hidden'} custom-scrollbar`}>
                                            {blogs?.data?.map((category: awarenessCategoryType, i: number) => (
                                                <li key={i} className={`p-2 ${blogs?.data?.length > 1 ? 'mb-2' : ''} text-sm font-medium rounded-md cursor-pointer flex items-center gap-2 hover:bg-blue-200/60 ${selectBlog?.title === category?.title ? 'bg-rose-600' : ''}`} onClick={() => handleBlogChange({ title: category?.title, _id: category?._id })}>
                                                    {category?.title}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Blog Tags */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {blogTag.map((tag: any) => (
                                            <div key={tag._id} className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-md flex items-center gap-2">
                                                {tag.title}
                                                <button onClick={() => setBlogTag((prev: any) => prev.filter((item: any) => item._id !== tag._id))} className="text-red-500 hover:text-red-700">
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            }

                            {/* Video Dropdown */}
                            {videos?.length > 0 &&
                                <>
                                    <div className="relative">
                                        <div onClick={() => setOpenVideo(!openVideo)} className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-green-100 border-transparent rounded-md cursor-pointer focus:border-blue-200">
                                            <span className={`font-medium ${selectVideo?.title ? 'text-gray-700' : 'text-gray-400'}`}>
                                                {selectVideo?.title ? selectVideo?.title : 'Select Video'}
                                            </span>

                                            <FaCaretDown className="m-1" />
                                        </div>

                                        <ul className={`mt-2 p-2 rounded-md w-32 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${openVideo ? 'max-h-60' : 'hidden'} custom-scrollbar`}>
                                            {videos?.map((category: awarenessCategoryType, i: number) => (
                                                <li key={i} className={`p-2 ${videos?.length > 1 ? 'mb-2' : ''} text-sm font-medium rounded-md cursor-pointer flex items-center gap-2 hover:bg-blue-200/60 ${selectVideo?.title === category?.title ? 'bg-rose-600' : ''}`} onClick={() => handleVidoeChange({ title: category?.title, _id: category?._id })}>
                                                    {category?.title}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Video Tags */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {videoTag.map((tag: any) => (
                                            <div key={tag._id} className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-md flex items-center gap-2">
                                                {tag.title}
                                                <button onClick={() => setVideoTag((prev: any) => prev.filter((item: any) => item._id !== tag._id))} className="text-red-500 hover:text-red-700">
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            }

                            {/* Quiz Dropdown */}
                            {quiz?.length > 0 &&
                                <>
                                    <div className="relative">
                                        <div onClick={() => setOpenQuiz(!openQuiz)} className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-green-100 border-transparent rounded-md cursor-pointer focus:border-blue-200">
                                            <span className={`font-medium ${selectQuiz?.title ? 'text-gray-700' : 'text-gray-400'}`}>
                                                {selectQuiz?.title ? selectQuiz?.title : 'Select Quiz'}
                                            </span>

                                            <FaCaretDown className="m-1" />
                                        </div>

                                        <ul className={`mt-2 p-2 rounded-md w-32 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${openQuiz ? 'max-h-60' : 'hidden'} custom-scrollbar`}>
                                            {quiz?.map((category: awarenessCategoryType, i: number) => (
                                                <li key={i} className={`p-2 ${quiz?.length > 1 ? 'mb-2' : ''} text-sm font-medium rounded-md cursor-pointer flex items-center gap-2 hover:bg-blue-200/60 ${selectQuiz?.title === category?.title ? 'bg-rose-600' : ''}`} onClick={() => handleQuizChange({ title: category?.title, _id: category?._id })}>
                                                    {category?.title}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Quiz Tags */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {quizTag.map((tag: any) => (
                                            <div key={tag._id} className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-md flex items-center gap-2">
                                                {tag.title}
                                                <button onClick={() => setQuizTag((prev: any) => prev.filter((item: any) => item._id !== tag._id))} className="text-red-500 hover:text-red-700">
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            }

                            {/* Test Dropdown */}
                            {test?.length > 0 &&
                                <>
                                    <div className="relative">
                                        <div onClick={() => setOpenTest(!openTest)} className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-green-100 border-transparent rounded-md cursor-pointer focus:border-blue-200">
                                            <span className={`font-medium ${selectTest?.title ? 'text-gray-700' : 'text-gray-400'}`}>
                                                {selectTest?.title ? selectTest?.title : 'Select Test'}
                                            </span>

                                            <FaCaretDown className="m-1" />
                                        </div>

                                        <ul className={`mt-2 p-2 rounded-md w-32 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${openTest ? 'max-h-60' : 'hidden'} custom-scrollbar`}>
                                            {test?.map((category: awarenessCategoryType, i: number) => (
                                                <li key={i} className={`p-2 ${test?.length > 1 ? 'mb-2' : ''} text-sm font-medium rounded-md cursor-pointer flex items-center gap-2 hover:bg-blue-200/60 ${selectTest?.title === category?.title ? 'bg-rose-600' : ''}`} onClick={() => handleTestChange({ title: category?.title, _id: category?._id })}>
                                                    {category?.title}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* test Tags */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {testTag.map((tag: any) => (
                                            <div key={tag._id} className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-md flex items-center gap-2">
                                                {tag.title}
                                                <button onClick={() => setTestTag((prev: any) => prev.filter((item: any) => item._id !== tag._id))} className="text-red-500 hover:text-red-700">
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            }

                        </div>

                        <div className="flex">
                            <button className="px-4 py-2 text-white rounded-md bg-[#1f3c88] hover:bg-[#2d56bb] disabled:bg-gray-400" type="submit" >{isUpdate ? "Update" : "Submit"}</button>
                            <button className="px-4 py-2 ml-8 text-white rounded-md bg-rose-600 hover:bg-rose-700" type="button" onClick={clearhandler}>Cancel</button>
                        </div>
                    </div>
                </div>
            </form >
        </div >
    )
}

export default AddDailyTask