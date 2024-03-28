import React, { useState } from "react";
import propTypes from "prop-types";

import { Col, Input, Row, message } from "antd";
import { LoadingOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";
import apiConstants from "../../config/apiConstants";

const UpdateReferralCode = ({ code, setCode, user_id, setIsEditing, iconSize }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [referralCode, setReferralCode] = useState(code);

  const updateReferralCode = async (ref_code) => {
    try {
      setIsSaving(true);
      const endpoint = apiConstants.UPDATE_REFERRAL_CODE;
      const url = `${apiConstants.BASE_URL}${endpoint.url}${user_id ? `/${user_id}` : ""}`;
      let res = await callApi(endpoint.method, url, { referral_code: ref_code });
      res = res.data;
      if (res.status) {
        message.success(res.message);
        setReferralCode(referralCode);
        setCode(referralCode);
        setIsEditing(false);
      } else message.error(res.message);
    } catch (err) {
      console.error("Error getting bet referral code", err);
      const axiosEerror = getAxiosError(err);
      message.error(axiosEerror);
    } finally {
      setIsSaving(false);
    }
  };

  const onChange = (e) => setReferralCode(e?.target?.value?.toUpperCase());

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      updateReferralCode(event?.target?.value);
    }
  };

  return (
    <Row>
      <Col>
        <Input
          value={referralCode}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          maxLength={12}
          minLength={4}
          style={{ width: 140 }}
          size="small"
        />
      </Col>
      <Col>
        {isSaving ? (
          <LoadingOutlined />
        ) : (
          <SaveOutlined
            onClick={() => updateReferralCode(referralCode)}
            title="Update Referral Code"
            style={{ cursor: "pointer", margin: "0px 5px", fontSize: iconSize }}
          />
        )}
      </Col>
      <Col>
        <CloseOutlined
          onClick={() => setIsEditing(false)}
          title="Cancel Edit"
          style={{ cursor: "pointer", margin: "0px 5px", fontSize: iconSize }}
        />
      </Col>
    </Row>
  );
};

UpdateReferralCode.propTypes = {
  code: propTypes.oneOfType([propTypes.string, null]),
  setCode: propTypes.func,
  user_id: propTypes.string,
  setIsEditing: propTypes.func,
  iconSize: propTypes.number,
};
UpdateReferralCode.defaultProps = {
  user_id: "",
  code: "",
  setCode: () => {},
  setIsEditing: () => {},
  iconSize: 20,
};

export default UpdateReferralCode;
