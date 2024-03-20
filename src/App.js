import React from "react";
import { Layout } from "antd";
import AppContent from "./components/AppContent";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Breadcrumb from "./components/Breadcrumb";
import isAuthenticated from "./components/hoc/isAuthenticated";

const { Footer } = Layout;
const theme = "dark";
const App = () => (
  <div className="App">
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <Sidebar theme={theme} />
      <Layout>
        <Header theme={theme} />
        <div style={{ padding: "6px 12px" }}>
          <Breadcrumb />
        </div>

        <AppContent />
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Footer Content Here
        </Footer>
      </Layout>
    </Layout>
  </div>
);

export default isAuthenticated(App);
