import React from "react";
import propTypes from "prop-types";

const Title = ({ title, titleStyle, containerStyle }) => (
  <div style={containerStyle}>
    <div style={titleStyle}>{title}</div>
  </div>
);
Title.defaultProps = {
  titleStyle: {
    fontSize: 32,
    fontWeight: 500,
    paddingBottom: 20,
  },
  containerStyle: {
    textAlign: "center",
    borderBottom: "1px solid #ccc",
    marginBottom: 24,
  },
};
Title.propTypes = {
  title: propTypes.string.isRequired,
  titleStyle: propTypes.shape({
    fontSize: propTypes.oneOfType([propTypes.number, propTypes.string]),
    fontWeight: propTypes.oneOfType([propTypes.number, propTypes.string]),
    paddingBottom: propTypes.oneOfType([propTypes.number, propTypes.string]),
  }),
  containerStyle: propTypes.shape({
    textAlign: propTypes.oneOfType([propTypes.number, propTypes.string]),
    borderBottom: propTypes.oneOfType([propTypes.number, propTypes.string]),
    marginBottom: propTypes.oneOfType([propTypes.number, propTypes.string]),
  }),
};
export default Title;
