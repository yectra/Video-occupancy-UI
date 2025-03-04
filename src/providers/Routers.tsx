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
const TrackerSetupView = React.lazy(() =>import("@/pages/dashboard/views/liveoccupancytracker/TrackerSetupView"));

//Preview
const TrackerVideoView = React.lazy(() => import("@/pages/dashboard/views/liveoccupancytracker/TrackerVideoView"));

//Overview
const TrackerOverview = React.lazy(() =>import("@/pages/dashboard/views/liveoccupancytracker/TrackerOverview"));

//Add Employee
const EmployeeForm = React.lazy(() => import("@/pages/dashboard/components/attendancetracker/EmployeeForm"));

//EmployeeForm
const ManageEmployeeForm = React.lazy(() => import ("@/pages/dashboard/components/attendancetracker/ManageEmployeeForm"));

//Attendance
const AttendanceView = React.lazy(() => import("@/pages/dashboard/views/attendancetracker/AttendanceView"));

//AttendanceList
const AttendanceListView = React.lazy(() =>import("@/pages/dashboard/views/attendancetracker/AttendanceListView"));

//AttendanceSetupView
const AttendanceSetupView = React.lazy(() =>import("@/pages/dashboard/views/attendancetracker/AttendanceSetupView"))

//OrganizationView
const OrganizationView = React.lazy(() =>import("@/pages/dashboard/views/attendancetracker/OrganizationView"))

//EmployeeDetails
const EmployeeDetailsView = React.lazy(() =>import("@/pages/dashboard/views/attendancetracker/EmployeeDetailsView"));

//users
const UsersDetails = React.lazy(() => import("@/pages/users/index"));

//UserTracker
const UserTrackerView = React.lazy(() => import("@/pages/users/views/UserTrackerView"));

//Setup
const TrackerSetup = React.lazy(()=> import("@/pages/dashboard/views/liveoccupancytracker/TrackerSetup"))

//Setup List
const TrackerSetupListView = React.lazy(() =>import("@/pages/dashboard/views/liveoccupancytracker/TrackerSetupListView"));

const route = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <DashboardSetupView />,
          },
          {
            path: "dashboard/occupancy-tracker",
            element: <LiveOccupancyTrackerView />,
            children: [
              {
                path:"",
                element:<TrackerSetupView/>
              },
              {
                path:"preview",
                element:<TrackerVideoView/>
              },
              {
                path:"organization",
                element:<OrganizationView/>
              },
              {
                path:"attendance-setup",
                element:<AttendanceSetupView/>,
              },
              {
                path: "",
                element: <Layout />,
                children: [

                  {
                    path: "overview",
                    element: <TrackerOverview />,
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
            path:"dashboard/tracker-setup",
            element: <TrackerSetup />,
            children: [
              {
                path: "",
                element: <TrackerSetupListView />,
              }
            ]
          },
          {
            path: "dashboard/attendance",
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
        path:"user-details",
        element:<UsersDetails/>,
        children:[
          {
            path:"",
            element:<UserTrackerView/>
          }
        ]
      } 
    ],
  },
];

export default route;