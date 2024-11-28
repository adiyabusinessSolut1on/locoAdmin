import { useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import { useGetDataQuery, useUpdatePostMutation } from "../api";
import { toast } from "react-toastify";
import { BlogSTyepes } from "../types";
import { FaCaretDown } from "react-icons/fa";

interface Props {
  setCategoryForm: React.Dispatch<React.SetStateAction<boolean>>;
}

interface BlogDetails {
  name?: string;
  _id?: string;
}

interface BlogStateType {
  blogId: BlogDetails | null;
  message: string;
  title: string;
}

const CreatNotification = ({ setCategoryForm }: Props) => {
  const [notificationDataForm, setNotificationDataForm] =
    useState<BlogStateType>({
      blogId: null,
      title: "",
      message: "",
    });
  const [updatePost] = useUpdatePostMutation();

  const { data } = useGetDataQuery({
    url: "/blog/getallblogs",
  });

  console.log(data, "blog data");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationDataForm((prev) => ({
      ...prev,
      [e?.target?.name]:
        e?.target?.type === "checkbox" ? e?.target?.checked : e?.target?.value,
    }));
  };

  const [isOpen, setOpen] = useState(false);

  const selectOption = (field: string, value: BlogDetails) => {
    console.log(value);
    setNotificationDataForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setOpen((prev) => !prev);
  };

  const submiteHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(notificationDataForm);
    try {
      const payload = {
        blogId: notificationDataForm?.blogId?._id,
        title: notificationDataForm?.title,
        message: notificationDataForm?.message,
      };

      console.log(payload);
      toast.loading("Checking Details");
      const response = await updatePost({
        data: payload,
        method: "POST",
        path: "/notify",
      });
      console.log(response);
      if (response?.data?.success) {
        toast.dismiss();
        toast.success(response?.data?.message, {
          autoClose: 5000,
        });
        closeHandler();
      } else {
        toast.dismiss();
        toast.error("Failed to create Notification");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error creating Notification:", error);
      toast.error("An error occurred");
    }
  };

  const closeHandler = () => {
    // if (isCategoryForm) {
    setCategoryForm((prev) => !prev);
    // }

    setNotificationDataForm({
      blogId: null,
      title: "",
      message: "",
    });
    console.log(notificationDataForm);
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center px-4 sm:px-0 bg-black/40"
      onClick={closeHandler}
    >
      <div
        className="bg-white rounded-md w-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="" onSubmit={submiteHandler}>
          {/* left section */}
          <div className="p-6 px-8 rounded font-montserrat">
            <div className="flex pb-2">
              <h2 className=" md:text-4xl text-[28px] font-bold text-gray-700 font-mavenPro">
                Notification Form
              </h2>
              <button onClick={closeHandler}>
                <TiArrowBackOutline className="w-10 h-10 ml-4 hover:text-orange-600 text-sky-600" />
              </button>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 py-4 md:grid-cols-2 font-mavenPro">
              <input
                value={notificationDataForm?.title}
                type="text"
                onChange={handleChange}
                name="title"
                className={
                  " font-medium outline-none w-full  border h-10 border-transparent bg-blue-100 rounded-md pl-4 focus-within:border-blue-400  "
                }
                placeholder={"Enter Title"}
                required
              />
              <input
                value={notificationDataForm?.message}
                type="text"
                onChange={handleChange}
                name="message"
                className={
                  " font-medium outline-none w-full  border h-10 border-transparent bg-blue-100 rounded-md pl-4 focus-within:border-blue-400  "
                }
                placeholder={"Enter Message"}
                required
              />
              <div className="relative md:col-span-2">
                <div
                  className="flex justify-between p-2 pl-4 font-medium text-gray-400 bg-blue-100 border-transparent rounded-md cursor-pointer focus:border-blue-200"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <p
                    className={` 
                  ${notificationDataForm.blogId !== null ? "text-gray-700" : ""}
                  `}
                  >
                    {notificationDataForm.blogId !== null
                      ? notificationDataForm.blogId?.name
                      : "Select Blog"}
                  </p>
                  <FaCaretDown className="m-1" />
                </div>
                <ul
                  className={`mt-2 p-2 rounded-md w-64 text-[#DEE1E2] bg-gray-800 shadow-lg absolute z-10 ${
                    isOpen ? "max-h-60" : "hidden"
                  } custom-scrollbar`}
                >
                  {data?.data?.length > 0 ? (
                    data?.data?.map((blog: BlogSTyepes, i: number) => (
                      <li
                        key={i}
                        className={`p-2 mb-2 text-sm text-[#DEE1E2]  rounded-md cursor-pointer hover:bg-blue-200/60 ${
                          notificationDataForm.blogId?.name === blog?.title
                            ? "bg-rose-600"
                            : ""
                        }`}
                        onClick={() =>
                          selectOption("blogId", {
                            name: blog?.title,
                            _id: blog?._id,
                          })
                        }
                      >
                        <span>{blog.title}</span>
                      </li>
                    ))
                  ) : (
                    <div>Data Not Found</div>
                  )}
                </ul>
              </div>
            </div>
            {/* </div> */}

            <div className="flex ">
              <button
                className="px-4 py-2 text-white bg-[#1f3c88] rounded hover:bg-[#2950b1]"
                type="submit"
              >
                {/* Save Changes */}
                Submit
              </button>
              <button
                className="px-4 py-2 ml-8 text-white bg-red-500 rounded hover:bg-red-400"
                onClick={closeHandler}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatNotification;
