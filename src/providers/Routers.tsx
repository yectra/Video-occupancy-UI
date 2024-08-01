import React from "react";

//Layout
const Layout = React.lazy(() => import("@/common/Layout"));

//MainLayout
const MainLayout = React.lazy(() => import("@/pages/MainLayout"));

//Dashboard
const DashboardSetupView = React.lazy(() => import("@/pages/dashboard/views/DashboardSetupview"));

//Admin
const Dashboard = React.lazy(() => import("@/pages/dashboard/index"));

//LiveOccupancyTracker
const LiveOccupancyTrackerView = React.lazy(() =>import("@/pages/dashboard/views/liveoccupancytracker/LiveOccupancyTrackerView"));

//Setup
const TrackerSetupView = React.lazy(() =>import("@/pages/dashboard/views/liveoccupancytracker/views/TrackerSetupView"));

//Overview
const TrackerOverview = React.lazy(() =>import("@/pages/dashboard/views/liveoccupancytracker/views/TrackerOverview"));

//EmployeeView
const EmployeeView = React.lazy(() => import("@/pages/dashboard/components/liveoccupancytracker/EmployeeView"));

//Add Employee
const EmployeeForm = React.lazy(() => import("@/pages/dashboard/components/liveoccupancytracker/EmployeeForm"));

//EmployeeForm
const ManageEmployeeForm = React.lazy(() => import ("@/pages/dashboard/components/liveoccupancytracker/ManageEmployeeForm"));

//Attendance
const AttendanceView = React.lazy(() => import("@/pages/dashboard/views/attendancetracker/AttendanceView"));

//AttendanceList
const AttendanceListView = React.lazy(() =>import("@/pages/dashboard/views/attendancetracker/views/AttendanceListView"));

//EmployeeDetails
const EmployeeDetailsView = React.lazy(() =>import("@/pages/dashboard/views/attendancetracker/views/EmployeeDetailsView"));

//users
const UsersDetails = React.lazy(() => import("@/pages/users/index"));

//UserTracker
const UserTrackerView = React.lazy(() => import("@/pages/users/views/UserTrackerView"));

const route = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <DashboardSetupView />,
          },
          {
            path: "occupancy-tracker",
            element: <LiveOccupancyTrackerView />,
            children: [
              {
                path:"",
                element:<TrackerSetupView/>
              },
              {
                path: "overview",
                element: <Layout />,
                children: [
                  {
                    path: "",
                    element: <TrackerOverview />,
                  },
                  {
                    path:"emp-view",
                    element:<EmployeeView/>
                  },
                  {
                    path:"add-emp",
                    element:<EmployeeForm/>,
                  },
                  {
                    path:"emp-form",
                    element:<ManageEmployeeForm />,
                  },
                ],
              },
            ],
          },
          {
            path: "attendance",
            element: <AttendanceView />,
            children: [
              {
                path: "",
                element: <AttendanceListView />,
              },
              {
                path:"emp-details",
                element: <EmployeeDetailsView />
              },
            ],
          },
        ],
      },
      {
        path: "user-details",
        element: <UsersDetails />,
        children: [
          {
            path: "",
            element: <UserTrackerView />,
          },
        ],
      },
    ],
  },
];

export default route;
