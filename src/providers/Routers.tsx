import React from "react";

//Layout
const Layout = React.lazy(() => import("@/common/Layout"));
const UserLayout = React.lazy(() => import("@/common/UserLayout"));

//MainLayout
const MainLayout = React.lazy(() => import("@/pages/MainLayout"));

//Admin
const Dashboard = React.lazy(() => import("@/pages/dashboard/index"));

//Add Employee
const EmployeeForm = React.lazy(() => import("@/pages/dashboard/components/attendancetracker/EmployeeForm"));

//EmployeeForm
const ManageEmployeeForm = React.lazy(() => import("@/pages/dashboard/components/attendancetracker/ManageEmployeeForm"));

//Attendance
const AttendanceTrackerView = React.lazy(() => import("@/pages/dashboard/views/attendancetracker/AttendanceTrackerView"))

//AttendanceList
const AttendanceListView = React.lazy(() => import("@/pages/dashboard/views/attendancetracker/AttendanceListView"));

//AttendanceSetupView
const AttendanceSetupView = React.lazy(() => import("@/pages/dashboard/views/attendancetracker/AttendanceSetupView"))

//OrganizationView
const OrganizationView = React.lazy(() => import("@/pages/dashboard/views/attendancetracker/OrganizationView"))

//EmployeeDetails
const EmployeeDetailsView = React.lazy(() => import("@/pages/dashboard/views/attendancetracker/EmployeeDetailsView"));

//UserTracker
const UserTrackerView = React.lazy(() => import("@/pages/users/views/UserTrackerView"));

//Setup List
const AttendanceSetupListView = React.lazy(() => import("@/pages/dashboard/components/attendancetracker/AttendanceSetupUpdateView"));

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
            path: "dashboard/attendance",
            element: <AttendanceTrackerView />,
            children: [
              {
                path: "",
                element: <OrganizationView />,
              },
              {
                path: "attendance-setup",
                element: <AttendanceSetupView />,
              },
              {
                path: "",
                element: <UserLayout />,
                children: [
                  {
                    path: "user-details",
                    element: <UserTrackerView />
                  }
                ]
              },
              {
                path: "",
                element: <Layout />,
                children: [
                  {
                    path: "emp-attendance",
                    element: <AttendanceListView />
                  },
                  {
                    path: "attendance-details",
                    element: <EmployeeDetailsView />
                  },
                  {
                    path: "add-emp",
                    element: <EmployeeForm />,
                  },
                  {
                    path: "emp-form",
                    element: <ManageEmployeeForm />,
                  },
                  {
                    path: "attendance-update",
                    element: <AttendanceSetupListView />
                  },
                ],
              },
            ],
          },
        ],
      }
    ],
  },
];

export default route;