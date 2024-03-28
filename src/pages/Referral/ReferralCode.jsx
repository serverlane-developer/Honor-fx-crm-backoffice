import React from "react";
import propTypes from "prop-types";
import { CopyOutlined } from "@ant-design/icons";
import { message } from "antd";
import { copyTextToClipboard } from "../../helpers/CopyToClipboardHelper";

const ReferralCode = ({ code, fontSize, iconSize, codeStyle }) => {
  if (!code) return null;
  const handleCopy = () => {
    if (!code) return null;
    copyTextToClipboard(code);
    return message.success(`"${code}" Copied to Clipboard`);
  };
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            fontSize,
            fontWeight: "bold",
            marginRight: 12,
            border: "2px solid grey",
            padding: "8px 32px",
            borderRadius: 8,
            ...codeStyle,
          }}
        >
          {code}
        </div>
        <div title="Copy Code">
          <CopyOutlined
            onClick={handleCopy}
            title="Copy Code"
            style={{ cursor: "pointer", margin: "0px 5px", fontSize: iconSize }}
          />
        </div>
      </div>
    </div>
  );
};
ReferralCode.propTypes = {
  code: propTypes.string,
  fontSize: propTypes.number,
  iconSize: propTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  codeStyle: propTypes.object,
};
ReferralCode.defaultProps = {
  code: "",
  fontSize: 20,
  iconSize: "xl",
  codeStyle: {},
};

export default ReferralCode;
