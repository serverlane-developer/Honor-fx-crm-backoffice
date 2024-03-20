/* eslint-disable camelcase */
import React from "react";
import propTypes from "prop-types";
import { Button, Row, Tooltip, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { splitAndCapitalise } from "../../../helpers/functions";
import { copyTextToClipboard } from "../../../helpers/CopyToClipboardHelper";

const CopyDetails = ({ amount, username, account_number, account_name, ifsc }) => {
  const onCopy = () => {
    const details = { amount, username, account_number, account_name, ifsc };
    const str = Object.keys(details)
      .map((x) => {
        const value = details[x];
        const label = splitAndCapitalise(x);
        return `${label}: ${value}`;
      })
      .join("\n");
    copyTextToClipboard(str);
    message.success("Details Copied to Clipboard");
  };

  return (
    <Row align="middle" justify="end">
      <Tooltip title="Copy Detiails">
        <Button icon={<CopyOutlined />} onClick={onCopy} />
      </Tooltip>
    </Row>
  );
};
CopyDetails.propTypes = {
  amount: propTypes.string.isRequired,
  username: propTypes.string.isRequired,
  account_number: propTypes.string.isRequired,
  account_name: propTypes.string.isRequired,
  ifsc: propTypes.string.isRequired,
};

export default CopyDetails;
