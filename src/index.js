import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "antd/dist/reset.css";

import { Provider } from "react-redux";
import routes from "./utility/routes";
import store from "./store";

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
