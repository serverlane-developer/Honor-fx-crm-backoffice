import React from "react";

import ErrorPage from "../pages/ErrorPage";
import modules from "./modules";
import App from "../App";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

const routes = [
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [...modules],
  },
];

export default routes;
