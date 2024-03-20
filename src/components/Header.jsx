import React from "react";
import { Col, Layout, message, Row, Tooltip } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { oneOf } from "prop-types";
import { useNavigate } from "react-router-dom";

import CookieHelper from "../helpers/CookieHelper";
import { setLoginData } from "../reducers/login";

const Header = ({ theme }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.login);
  const navigate = useNavigate();

  const onLogout = () => {
    try {
      const cookieHelper = new CookieHelper();
      cookieHelper.setCookie("", null, -365);
      dispatch(setLoginData(null));
      message.success("Logout Successful");
      navigate("/login", { replace: true });
      window.location.reload();
    } catch (err) {
      message.error("Something went wrong while logging out! Please try again");
    }
  };

  return (
    data && (
      <Layout.Header
        style={{
          padding: 0,
          paddingLeft: 12,
          backgroundColor: theme === "dark" ? "#001529" : "#fff",
          color: "#fff",
        }}
      >
        <Row align="middle">
          <Col span={23}>
            <Row>
              <div style={{ fontSize: 18 }}>
                Welcome <span style={{ fontWeight: 400 }}>{data.username}</span>
              </div>
            </Row>
          </Col>
          <Col span={1}>
            <Tooltip title="Logout">
              <LogoutOutlined onClick={onLogout} style={{ fontSize: 20 }} />
            </Tooltip>
          </Col>
        </Row>
      </Layout.Header>
    )
  );
};
Header.propTypes = {
  theme: oneOf(["light", "dark"]).isRequired,
};
export default Header;
