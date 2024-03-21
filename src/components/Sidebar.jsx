import React, { useEffect, useState } from "react";

// sidebar nav config
import Sider from "antd/es/layout/Sider";
import { Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { oneOf } from "prop-types";

import { toggleSidebar } from "../reducers/sidebar";
import appConstants from "../config/appConstants";

import routes, { menuItems as modules } from "../utility/modules";

const Sidebar = ({ theme }) => {
  const dispatch = useDispatch();
  const sidebarState = useSelector((state) => state.sidebar);
  const accessRights = useSelector((state) =>
    state.login.data && state.login.data.access_rights ? state.login.data.access_rights : []
  );
  const { collapsed } = sidebarState;

  const location = useLocation();
  const naviagte = useNavigate();

  const path = location.pathname.toLowerCase().split("/");

  const selectedMenu = [path.join(""), path.filter((x) => x).join("_"), path[path.length - 1], `${path[1]}main`];
  const [menuItems, setMenuItems] = useState(modules);

  const onMenuClick = ({ key } = {}) => {
    const menu = routes.find((x) => x.key === key);
    if (menu) {
      naviagte(`/${menu.path}`);
    }
  };

  useEffect(() => {
    const initialise = () => {
      const items = [];
      const uniqueModules = Array.from(new Set(accessRights.map((x) => x.module_name.toLowerCase())));
      for (let i = 0; i < modules.length; i += 1) {
        const module = modules[i];
        const label = module?.label?.toLowerCase();

        if (uniqueModules.includes(label) || appConstants.accessibleModules.includes(label)) {
          items.push(module);
        }
      }
      setMenuItems(items);
    };

    initialise();
  }, [accessRights]);

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={() => dispatch(toggleSidebar())} theme={theme}>
      <div
        style={{
          minHeightheight: 32,
          margin: 16,
          color: "#fff",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        HONOR FX
      </div>
      <Menu theme={theme} selectedKeys={selectedMenu} onClick={onMenuClick} mode="inline" items={menuItems} />
    </Sider>
  );
};
Sidebar.propTypes = {
  theme: oneOf(["light", "dark"]).isRequired,
};

export default React.memo(Sidebar);
