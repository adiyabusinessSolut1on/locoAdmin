// App.js
import "./App.css";
import { RouterProvider, createBrowserRouter, Navigate, } from "react-router-dom";
import Login from "./pages/login";
import Layout from "./layout";
import Create_Category from "./pages/create-category";
import BlogList from "./pages/BlogList";
import VideoCategory from "./pages/VideoCategory";
import UploadVideo from "./pages/uploadvideo";
import PrivateRoute from "./middleware/privateroute";
import ForgetPassword from "./pages/ForgetPassword";
import Authentication from "./pages/Authentication";
import ResetPassword from "./pages/ResetPassword";
import ErrorElement from "./pages/ErrorElement";
import Awareness from "./pages/Awareness";
import CreatAwareness from "./forms/CreatAwareness";
import AwarenessCategory from "./pages/AwarenessCategory";
import ImportantDocuments from "./pages/ImportantDocuments";

import SponserCompany from "./pages/SponserCompany";
import SponserCompaniesForm from "./forms/SponserCompaniesForm";
import SponsorCompanyProfile from "./pages/SponsorCompanyProfile";
import CreatBlog from "./pages/CreatBlog";
import UserUpdate from "./forms/UserUpdate";
import UserList from "./pages/UserList";
import Quiz from "./pages/Quiz";
import QuizProfile from "./pages/QuizProfile";
import Test from "./pages/Test";
import TestProfile from "./pages/TestProfile";
import Video from "./pages/videos";
import DalyTasks from "./pages/Daily_Task";
import CreatDocuments from "./pages/CreatDocuments";
import QuizAndTestCategory from "./pages/QuizAndTestCategory";
import UpdateSetting from "./pages/UpdateSetting";
import AddAppSetting from "./pages/AddAppSetting";
import Report from "./pages/Report";
import AddDailyTask from "./pages/AddDailyTask";

function App() {
  const token = localStorage.getItem("user");
  console.log("user: ", localStorage.getItem("user"));
  console.log("token: ", token);

  const isValidToken = token ? true : false;
  console.log("Tokaen in Storage>>>", isValidToken);
  const route = createBrowserRouter([
    {
      path: "/login",
      element: !isValidToken ? <Authentication /> : <Navigate to="/" />,
      children: [
        // {
        //   path: "register",
        //   element: <RegisterUser />,
        // },
        {
          path: "",
          element: <Login />,
        },
        {
          path: "forgot-password",
          element: <ForgetPassword />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
      ],
    },

    {
      path: "/",
      element: <PrivateRoute token={isValidToken} />,
      children: [
        {
          path: "",
          element: <Layout />,
          errorElement: <ErrorElement />,
          children: [
            {
              path: "creat-blog",
              element: <CreatBlog />,
            },
            {
              path: "blogcategory",
              element: <Create_Category />,
            },
            {
              path: "creat-blog/blogs-list",
              element: <BlogList />,
            },
            {
              path: "creat-blog/blogs-list/update-blog/:id",
              element: <CreatBlog />,
            },
            {
              path: "videocategory",
              element: <VideoCategory />,
            },
            {
              path: "users",
              element: <UserList />,
            },
            {
              path: "users/:id",
              element: <UserUpdate />,
            },
            {
              path: "videos",
              element: <Video />,
            },
            {
              path: "videos/:id",
              element: <UploadVideo />,
            },
            // {
            //   path: "video/:id",
            //   element: <UpdateVideo />,
            // },
            {
              path: "videos/upload-video",
              element: <UploadVideo />,
            },
            {
              path: "daily-task",
              element: <DalyTasks />,
            },
            {
              path: "create-daily-task",
              element: <AddDailyTask />,
            },
            {
              path: "update-daily-task/:id",
              element: <AddDailyTask />,
            },
            {
              path: "awareness",
              element: <Awareness />,
            },
            {
              path: "awareness/creat-awareness",
              element: <CreatAwareness />,
            },
            {
              path: "awareness/:id",
              element: <CreatAwareness />,
            },
            {
              path: "awarenes-category",
              element: <AwarenessCategory />,
            },
            {
              path: "important-document",
              element: <ImportantDocuments />,
            },
            {
              path: "important-document/create-documents",
              element: <CreatDocuments />,
            },
            {
              path: "important-document/update-documents/:id",
              element: <CreatDocuments />,
            },
            {
              path: "sponsor",
              element: <SponserCompany />,
            },
            {
              path: "sponsor/profile/:id",
              element: <SponsorCompanyProfile />,
            },

            {
              path: "sponsor/company_form",
              element: <SponserCompaniesForm />,
            },
            {
              path: "sponsor/company_form/:id",
              element: <SponserCompaniesForm />,
            },

            {
              path: "quiz",
              element: <Quiz />,
            },
            {
              path: "qt-category",
              element: <QuizAndTestCategory />,
            },
            {
              path: "quiz/:id",
              element: <QuizProfile />,
            },
            {
              path: "test",
              element: <Test />,
            },
            {
              path: "test/:id",
              element: <TestProfile />,
            },
            {
              path: "update",
              element: <UpdateSetting />,
            },
            {
              path: "add-update",
              element: <AddAppSetting />,
            },
            {
              path: "update/:id",
              element: <AddAppSetting />,
            },
            {
              path: "report",
              element: <Report />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={route} />;
}

export default App;
