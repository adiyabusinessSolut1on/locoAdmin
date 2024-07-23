// import { useState } from "react";
// import {
//   useCreatePostMutation,
// } from "../api";

// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import uploadFile from "../firebase_file/file";

// interface Props {
//   title: string;
//   donwloadable: boolean;
//   link: string;
// }

// const CreatDocuments = () => {
//     const [createPost] = useCreatePostMutation();

//   const [value,setValue]=useState<Props>({
//     title:"",
//     link:"",
//     donwloadable:false,
//   })
//   const OnchangeValue=(name:string,val:React.ReactNode)=>{
//     setValue((prev)=>({...prev,[name]:val}))
//   }
// const [isExternal,setIsExternal]=useState(false)

//   const [progressStatus, setProgressStatus] = useState<number | null>(null);

//   const hanhleFilecUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target?.files?.[0];
//     if (selectedFile) {
//       try {
//         const imageUrl = await uploadFile(
//           selectedFile.name,
//           selectedFile,
//           setProgressStatus
//         );
//         setValue({ ...value, link: imageUrl });
//       } catch (error) {
//         console.error("Error uploading image:", error);
//         toast.error("Error uploading image");
//       }
//     }
//   };
//   const navigate = useNavigate();
//   //@ts-expect-error not define event specification use oly for prevent default event
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await createPost({
//         data: {...value},
//         path: `/important_link/create`,
//       });

//       if (response?.data?.success) {
//         toast.success(response.data.message, {
//           autoClose: 3000,
//         });

//         setValue({
//             link:"",
//             title:"",
//             donwloadable:false,
//           });
//       } else {
//         toast.error("Failed to create Sub sub-category");
//       }
//     } catch (error) {
//       toast.error("An error occurred");
//     }
//   };
//   return (
//     <div className="w-full p-5 bg-blue-100">
//       <ToastContainer />
//       <button
//         onClick={() => navigate("/important-document")}
//         className="bg-[#3d3d3d] text-[#f8f8f8] px-3 py-1 rounded-[7px] text-[14px] font-[600] mb-[10px] hover:bg-[#323131]"
//       >
//         View Document List
//       </button>
//       <form
//         onSubmit={handleCreate}
//         className="flex flex-col gap-5 border bg-white border-[#8d8787f5] p-10 rounded-[7px]"
//       >
//         <div className="flex flex-row gap-2 ">
//           <label className="block mb-2 font-semibold text-gray-700">
//             title
//           </label>
//           <input
//             value={value?.title}
//             onChange={(e) => OnchangeValue("title", e.target.value)}
//             type="text"
//             placeholder="Title"
//             className="border pl-4 border-[#b9b4b4da] bg-[#e7e5e592] outline-none p-1 rounded-[7px]"
//           />
//         </div>
//         <div className="flex flex-row gap-2 ">
//           <label className="block mb-2 font-semibold text-gray-700">
//             External URL
//           </label>
//           <input
//             checked={isExternal}
//             onChange={() => setIsExternal(!isExternal)}
//             type="checkbox"
//             className="border pl-4 border-[#b9b4b4da] bg-[#e7e5e592] outline-none p-1 rounded-[7px]"
//           />
//         </div>
//         {isExternal ? (
//           <div className="flex flex-col w-full gap-1">
//             <label className="block mb-2 font-semibold text-gray-700">
//               url{" "}
//             </label>
//             <input
//               value={value?.link}
//               onChange={(e) => OnchangeValue("link", e.target.value)}
//               type="text"
//               placeholder="Title"
//               className="border pl-4 border-[#b9b4b4da] bg-[#e7e5e592] outline-none p-1 rounded-[7px]"
//             />
//           </div>
//         ) : (
//           <div className="relative flex flex-row gap-5 mb-6 outline-none ">
//             <div className="w-full ">
//               <label className="block mb-2 font-semibold text-gray-700">
//                 Documents
//               </label>
//               <input
//                 type="file"
//                 accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
//                 onChange={hanhleFilecUpload}
//                 className=" border-[#b9b4b4da] bg-[#e7e5e592] p-3 border outline-none  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {progressStatus !== null && progressStatus !== 0 && (
//                 <>
//                   <div className="inset-0 z-10 flex flex-row items-end gap-2 pt-2">
//                     <p className="text-black text-[12px]">uploading</p>
//                     <div
//                       className="h-1 bg-blue-400 rounded-md mx-[1px] mb-[1px]"
//                       style={{ width: `${progressStatus}%` }}
//                     ></div>
//                   </div>
//                 </>
//               )}
//             </div>
//             {/* {state?.thumnail && (
//             <img
//               src={state?.thumnail}
//               alt={state?.title}
//               className="rounded-[5px] max-w-[300px] max-h-[200px]"
//             />
//           )} */}
//           </div>
//         )}

//         <div className="flex flex-row gap-2 ">
//           <label className="block mb-2 font-semibold text-gray-700">
//             Download Able
//           </label>
//           <input
//             checked={value?.donwloadable}
//             onChange={() => OnchangeValue("donwloadable", !value?.donwloadable)}
//             type="checkbox"
//             placeholder="Title"
//             className="border pl-4 border-[#b9b4b4da] bg-[#e7e5e592] outline-none p-1 rounded-[7px]"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={!value?.link || !value?.title}
//           className={`${
//             value?.link&&value?.title ? "bg-[#5a83bd]" : "bg-gray-500"
//           } text-center  mt-8 p-1 rounded-[8px] text-[15px] font-[600] text-[#f8f8f8]`}
//         >
//           save
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreatDocuments;
