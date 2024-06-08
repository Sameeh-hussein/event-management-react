import SignUp from "./shared/auth/register/SignUp";
import { createBrowserRouter } from "react-router-dom";
import SignUpAttendee from "./shared/auth/register/SignUpAttendee";
import SignUpOrganizer from "./shared/auth/register/SignUpOrganizer";
import RegisterContextProvider from "./shared/auth/context/Register";
import Home from "./components/pages/HomePage";
import AdminLayout from "./components/layouts/AdminLayout";
import MainLayout from "./components/layouts/MainLayout";
import NotFoundPage from "./components/pages/NotFoundPage";
import EventPage from "./components/pages/EventPage";
import OrganizerProfile from "./components/pages/OrganizerProfilePage.jsx";
import CreateEvetnPage from "./components/pages/CreateEvetnPage";
import Login from "./shared/auth/login/Login.jsx";
import ProtectedLogin from "./shared/auth/login/protectedLogin.jsx";
import EventDashboardHome from "./components/pages/EventDashboard/views/EventDashboardHome.jsx";
import AttendeeList from "./components/pages/EventDashboard/views/AttendeeList.jsx";
import RegistrationRequest from "./components/pages/EventDashboard/views/RegistrationRequest.jsx";
import EventDashboardLayout from "./components/layouts/EventDashboardLayout.jsx";
import VerificationRequest from "./components/pages/VerificationRequestPage.jsx";
import ReportTable from "./components/other/AdminDashboardComponents/ReportTable.jsx";
import AttendeeRequestTable from "./components/other/AdminDashboardComponents/AttendeeRequestTable.jsx";
import OrganizerRequestsData from "./components/other/AdminDashboardComponents/OrganizerRequestsData.jsx";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "event/:eventId",
        element: <EventPage />,
      },
      {
        path: "profile/:userName",
        element: <OrganizerProfile />,
      },
      {
        path: "events/create",
        element: <CreateEvetnPage />,
      },
      {
        path: "verification",
        element: <VerificationRequest />,
      },
    ],
  },
  {
    path: "event-dashboard/:eventId",
    element: <EventDashboardLayout />,
    children: [
      {
        index: true,
        element: <EventDashboardHome />,
      },
      {
        path: "Attendee-list",
        element: <AttendeeList />,
      },
      {
        path: "registration-request",
        element: <RegistrationRequest />,
      },
    ],
  },
  {
    path: "admin-dashboard",
    element: <AdminLayout />,
    children: [
      {
        path: "reports",
        element: <ReportTable />,
      },
      {
        path: "iv-request/attendee",
        element: <AttendeeRequestTable />,
      },
      {
        path: "iv-request/organizer",
        element: <OrganizerRequestsData />,
      },
    ],
  },
  {
    path: "register",
    element: (
      <RegisterContextProvider>
        <SignUp />
      </RegisterContextProvider>
    ),
  },
  {
    path: "login",
    element: (
      <ProtectedLogin>
        <Login />
      </ProtectedLogin>
    ),
  },
  {
    path: "attendee",
    element: (
      <RegisterContextProvider>
        <SignUpAttendee />
      </RegisterContextProvider>
    ),
  },
  {
    path: "eventorganizer",
    element: (
      <RegisterContextProvider>
        <SignUpOrganizer />
      </RegisterContextProvider>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
