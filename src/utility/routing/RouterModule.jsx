import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import PreventLoginRoutes from "./PreventLoginRoutes";
import Login from "../../pages/Login"
import Mainlayout from "../../layout/MainLayout"
import Dashboard from "../../pages/Dashboard"
import Users from "../../pages/Users";
const router = createBrowserRouter([
    {
      element: <PreventLoginRoutes />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
      ],
    },
    {
      element: <PrivateRoutes />,  // Wrap the dashboard route with PrivateRoutes
      children: [
        {
          path: "/dashboard",
          element: <Mainlayout />,
          children: [
            {
              index: true,
              element: <Dashboard/>,
            },
            {
              path: "users",
              index: true,
              element: <Users/>,
            },
          ],
        },
      ],
    },
  ]);
  


export const RouterModule = () => {
    return <RouterProvider router={router} />;
  };