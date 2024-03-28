import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { useSelector } from "react-redux";

import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";
import apiConstants from "../../config/apiConstants";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import UserReferralCode from "./UserReferralCode";
import ReferralCodeList from "./ReferralCodeList";
import ReferralCustomerList from "./ReferralCustomerList";

const Referral = () => {
  const { data } = useSelector((state) => state.login);
  const role = String(data?.role_name || "").toLowerCase();
  const [referral, setReferral] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getReferralCode = async () => {
    try {
      setErrorMessage(null);
      const endpoint = apiConstants.GET_REFERRAL_CODE;
      const url = `${apiConstants.BASE_URL}${endpoint.url}`;
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

  useEffect(() => {
    getReferralCode();
  }, []);

  if (isLoading) {
    return <Loader message="Loading Referral CODE..." padding={50} size={24} />;
  }

  if (errorMessage) return <ErrorMessage message={errorMessage} />;
  if (!referral) return <ErrorMessage message="Referral Code not found" />;

  return (
    <div>
      <Row align="middle" justify="space-between" gutter={[12, 12]}>
        <Col>
          <div style={{ fontSize: 32, fontWeight: "bold" }}>Referral</div>
        </Col>
        <Col>
          <UserReferralCode referral_code={referral} size="large" />
        </Col>
      </Row>
      <hr />
      <div style={{ marginTop: 12 }}>
        {["super admin", "admin"].includes(role) ? (
          <ReferralCodeList />
        ) : (
          <ReferralCustomerList referral_id={referral.referral_id} />
        )}
      </div>
    </div>
  );
};
export default Referral;
