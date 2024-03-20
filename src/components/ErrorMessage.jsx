import React from "react";

import propTypes from "prop-types";

const ErrorMessage = ({ message, fontSize }) => {
  const style = { fontSize, color: "red" };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <span style={style}>{message}</span>
    </div>
  );
};
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
  fontSize: propTypes.number,
};
ErrorMessage.defaultProps = {
  fontSize: 24,
};

export default ErrorMessage;
