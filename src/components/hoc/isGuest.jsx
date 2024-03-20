/* eslint-disable func-names */
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// For Pages which cannot be accessed after User has Logged in
const isGuest = (WrappedComponent) =>
  function (props) {
    const loginData = useSelector((state) => state?.login?.data);
    return !loginData ? <WrappedComponent {...props} /> : <Navigate to="/home" replace />;
  };

export default isGuest;
