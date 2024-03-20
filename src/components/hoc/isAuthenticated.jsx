/* eslint-disable func-names */
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import { createSelector } from "@reduxjs/toolkit";
import appConstants from "../../config/appConstants";

const hasAccessSelector = createSelector(
  (state) => state?.login?.data?.modules || [],
  (_, module) => module,
  (modules, currModule) => modules.includes(currModule)
);

// For Pages which cannot be accessed after User has Logged in
const isAuthenticated = (WrappedComponent) =>
  function (props) {
    const loginData = useSelector((state) => state?.login?.data);
    const location = useLocation();
    const path = location.pathname.toLowerCase().split("/");
    const [, module] = path; // gets module name from route

    const hasModuleAccess = useSelector((state) => hasAccessSelector(state, module));

    const isFreeModule = appConstants.accessibleModules.includes(module);

    const hasAccess = isFreeModule || hasModuleAccess; // if module from route has been assigned to user

    if (!loginData) return <Navigate to="/login" replace />; // if not authenticated > redirect to login
    if (!hasAccess) return <Navigate to="/home" replace />; // if has no access > redirect to home
    return <WrappedComponent {...props} />; // if logged in and has access continue
  };

export default isAuthenticated;
