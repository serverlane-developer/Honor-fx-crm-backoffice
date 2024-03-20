import React from "react";
import { useRouteError } from "react-router-dom";
import "./index.css";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <div
        title={error?.error?.message}
        style={{
          fontSize: 40,
        }}
      >
        {error.status}
        {" | "}
        {error.statusText}
      </div>
    </div>
  );
};

export default ErrorPage;
