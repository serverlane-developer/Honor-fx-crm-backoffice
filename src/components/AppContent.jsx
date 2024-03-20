import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { Layout } from "antd";
import Loader from "./Loader";

const { Content } = Layout;

const AppContent = () => (
  <Content style={{ overflow: "auto", backgroundColor: "#fff", padding: 24 }}>
    <Suspense fallback={<Loader />}>
      <Outlet />
    </Suspense>
  </Content>
);

export default React.memo(AppContent);
