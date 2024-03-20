/* eslint-disable react/forbid-prop-types */
import React from "react";
import propTypes from "prop-types";

const PaddedDiv = ({ children, ...props }) => (
  <div {...props} style={{ padding: 4, ...props.style }}>
    {children}
  </div>
);
PaddedDiv.propTypes = {
  children: propTypes.node.isRequired,
  style: propTypes.object,
};
PaddedDiv.defaultProps = {
  style: {},
};

const LabelValue = ({
  label = "",
  value = "",
  labelStyle = {},
  valueStyle = {},
  fontSize = 14,
  title = "",
  containerStyle = {},
}) =>
  value ? (
    <PaddedDiv title={title} style={containerStyle}>
      <span style={{ fontSize, ...labelStyle }}>{label}</span>
      <span style={{ paddingLeft: 6, fontWeight: "600", fontSize, ...valueStyle }}>{value}</span>
    </PaddedDiv>
  ) : null;
LabelValue.propTypes = {
  label: propTypes.string.isRequired,
  value: propTypes.oneOfType([propTypes.string, propTypes.number, propTypes.node]),
  labelStyle: propTypes.object,
  valueStyle: propTypes.object,
  fontSize: propTypes.number,
  title: propTypes.string,
  containerStyle: propTypes.object,
};
LabelValue.defaultProps = {
  value: null,
  labelStyle: {},
  valueStyle: {},
  fontSize: 14,
  title: "",
  containerStyle: {},
};

export default LabelValue;
