import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import StudentLogin from "../pages/student/Login";
import LecturerLogin from "../pages/lecturer/Login";
import AdminLogin from "../pages/admin/Login";
import StudentLayout from "../layouts/student/StudentLayout";
import LecturerLayout from "../layouts/lecturer/LecturerLayout";
import AdminLayout from "../layouts/admin/AdminLayout";
import StudentDashboard from "../pages/student/Dashboard";
import LecturerDashboard from "../pages/lecturer/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/student/login",
    element: <StudentLogin />,
  },
  {
    path: "/lecturer/login",
    element: <LecturerLogin />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      {
        path: "dashboard",
        element: <StudentDashboard />,
      },
    ],
  },
  {
    path: "/lecturer",
    element: <LecturerLayout />,
    children: [
      {
        path: "dashboard",
        element: <LecturerDashboard />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
]);

export default router;
