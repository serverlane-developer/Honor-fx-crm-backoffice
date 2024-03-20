import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Row, Spin } from "antd";
import PropTypes from "prop-types";

const Loader = ({ size, padding, height, message }) => {
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: size,
      }}
      spin
    />
  );
  return (
    <Row align="middle" justify="center" style={{ padding, height }}>
      <Spin indicator={antIcon} />
      {message && <div style={{ paddingLeft: 6 }}>{message}</div>}
    </Row>
  );
};
Loader.propTypes = {
  size: PropTypes.number,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  message: PropTypes.string,
};
Loader.defaultProps = {
  size: 60,
  padding: "25%",
  height: "auto",
  message: "",
};
export default Loader;
