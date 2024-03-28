import React, { useState } from "react";
import propTypes from "prop-types";
import { EditOutlined, SyncOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";
import apiConstants from "../../config/apiConstants";
import ErrorMessage from "../../components/ErrorMessage";
import ReferralCode from "./ReferralCode";
import UpdateReferralCode from "./UpdateReferralCode";

const sizeConfig = {
  large: {
    iconSize: 20,
  },
  small: {
    iconSize: 20,
    codeStyle: { border: "none", padding: 0 },
    fontSize: 16,
  },
  default: {
    iconSize: 20,
  },
};

const UserReferralCode = ({ user_id = "", code, referral_code = null, size = "normal" }) => {
  const [referral, setReferral] = useState(referral_code);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const sizeProps = sizeConfig[size] || sizeConfig.default;

  const getReferralCode = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const endpoint = apiConstants.GET_REFERRAL_CODE;
      const url = `${apiConstants.BASE_URL}${endpoint.url}${user_id ? `/${user_id}` : ""}`;
      let res = await callApi(endpoint.method, url);
      res = res.data;
      if (res.status) {
        setReferral(res.data);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      console.error("Error getting bet referral code", err);
      const axiosEerror = getAxiosError(err);
      // const msg = err?.response?.data?.message || err?.response?.data || err?.data?.message || err?.message;
      setErrorMessage(axiosEerror);
    } finally {
      setIsLoading(false);
    }
  };

  const setCode = (ref_code) => {
    if (!referral) return null;
    return setReferral({ ...referral, referral_code: ref_code });
  };

  if (code) return <ReferralCode code={code} />;

  if (errorMessage) {
    return (
      <div style={{ padding: "150px 0" }}>
        <ErrorMessage message={errorMessage} />
      </div>
    );
  }

  if (isEditing) {
    return (
      <UpdateReferralCode
        code={referral?.referral_code}
        setCode={setCode}
        setIsEditing={setIsEditing}
        user_id={user_id}
        {...sizeProps}
      />
    );
  }

  if (referral?.referral_code && isLoading) return <LoadingOutlined />;

  if (referral.referral_code) {
    return (
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <div>
          <ReferralCode code={referral?.referral_code} {...sizeProps} />
        </div>
        <div style={{ paddingLeft: 4 }}>
          <EditOutlined
            onClick={() => setIsEditing(true)}
            title="Edit"
            style={{ cursor: "pointer", margin: "0px 5px", fontSize: sizeProps.iconSize }}
          />
        </div>
        <div style={{ paddingLeft: 4 }}>
          <SyncOutlined
            onClick={getReferralCode}
            title="Refresh"
            style={{ cursor: "pointer", margin: "0px 5px", fontSize: sizeProps.iconSize }}
          />
        </div>
      </div>
    );
  }

  return (
    <Button type="primary" onClick={getReferralCode} loading={isLoading}>
      View Code
    </Button>
  );
};
UserReferralCode.propTypes = {
  user_id: propTypes.string,
  code: propTypes.string,
  referral_code: propTypes.string,
  size: propTypes.string,
};
UserReferralCode.defaultProps = {
  user_id: "",
  code: "",
  referral_code: "",
  size: "normal",
};

export default UserReferralCode;
