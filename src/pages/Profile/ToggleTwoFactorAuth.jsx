import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Input, Popconfirm, Row, Switch, message } from "antd";
import Constants from "../../config/apiConstants";
import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";
import Loader from "../../components/Loader";
import jwtHelper from "../../helpers/jwt";

const ToggleTwoFactorAuth = () => {
  const [twoFactorStatus, setTwoFactorStatus] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);
  const [isSwitching, setisSwitching] = useState(false);

  const [otpSent, setOtpSent] = useState(false);

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = () => {
    setError("");
    setOtpSent(false);
    setOtp("");
    setPopupOpen(false);
  };

  const requestToggleConfirmation = () => {
    setPopupOpen(true);
  };

  const cancelPopup = () => {
    setPopupOpen(false);
    setIsEnabled(twoFactorStatus);
  };

  const handle2faToggle = async () => {
    const endpoint = Constants.ADMIN_TOGGLE_2FA_STATUS;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      setisSwitching(true);
      setError("");
      const { data: resData } = await callApi(endpoint.method, url, { is_enabled: !isEnabled });
      const { status, message: resMessage } = resData;
      if (!status) {
        setError(resMessage);
        return;
      }
      setIsEnabled(!isEnabled);
      setOtpSent(true);
      message.success(resMessage);
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while switching 2FA status";
      console.error(errMessage, err, axiosError);
      setError(axiosError || errMessage);
      setIsEnabled(twoFactorStatus);
      setOtpSent(false);
    } finally {
      setisSwitching(false);
      setPopupOpen(false);
    }
  };

  const onOtpChange = (e) => {
    const value = e?.target?.value;
    const isNumber = /^[0-9]+$/.test(value);
    if (!isNumber) return;
    setOtp(value);
  };

  const handle2faConfirmation = async () => {
    const endpoint = Constants.ADMIN_CONFIRM_2FA_STATUS;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      setIsSubmitting(true);
      setError("");
      const { data: resData, headers } = await callApi(endpoint.method, url, { is_enabled: isEnabled, token: otp });
      const { status, message: resMessage, data } = resData;
      if (!status) {
        setError(resMessage);
        return;
      }
      data.token = headers.token;
      jwtHelper.handleJwt(data);
      message.success(resMessage);
      setOtpSent(false);
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while switching 2FA status";
      console.error(errMessage, err, axiosError);
      setError(axiosError || errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getStatus = async () => {
      const endpoint = Constants.ADMIN_GET_2FA_STATUS;
      const url = Constants.BASE_URL + endpoint.url;
      try {
        resetState();
        setIsLoading(true);
        const { data: resData } = await callApi(endpoint.method, url);
        const { data, status, message: resMessage } = resData;
        if (!status) {
          message.error(resMessage);
          return;
        }
        const enabled = data?.is_enabled;
        setTwoFactorStatus(enabled);
        setIsEnabled(enabled);
      } catch (err) {
        const axiosError = getAxiosError(err);
        const errMessage = "Error while getting 2FA status";
        console.error(errMessage, err, axiosError);
        message.error(axiosError || errMessage);
      } finally {
        setIsLoading(false);
      }
    };

    getStatus();
  }, []);

  if (isLoading) return <Loader message="Fteching 2FA Status" />;

  return (
    <div>
      {error && <Alert message={error} type="error" banner style={{ marginBottom: 12 }} />}

      <Row style={{ marginTop: 12 }} align="middle" justify="start" gutter={18}>
        <Col span={5} style={{ textAlign: "right" }}>
          Toggle 2FA Status
        </Col>
        <Col span={5}>
          <Popconfirm
            title="Are you sure?"
            description={`This will send you an OTP on your registered email ID. You can use it to  ${
              isEnabled ? "Disable" : "Enable"
            } 2FA`}
            open={popupOpen}
            onConfirm={handle2faToggle}
            onCancel={cancelPopup}
            disabled={otpSent}
          >
            <Switch
              loading={isSwitching}
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
              onChange={requestToggleConfirmation}
              checked={isEnabled}
              disabled={otpSent}
            />
          </Popconfirm>
        </Col>
      </Row>
      {otpSent && (
        <Row style={{ marginTop: 12 }} align="middle" justify="start" gutter={18}>
          <Col span={5} style={{ textAlign: "right" }}>
            Confirm OTP to {isEnabled ? "Disable" : "Enable"} 2FA
          </Col>
          <Col span={5}>
            <Input.Password
              placeholder="Enter OTP"
              autoFocus
              inputMode="numeric"
              autoComplete="off"
              maxLength={6}
              name="otp"
              onPressEnter={handle2faConfirmation}
              value={otp}
              onChange={onOtpChange}
              disabled={isSubmitting}
              width={100}
            />
          </Col>
          <Col span={5}>
            <Button type="primary" onClick={handle2faConfirmation} loading={isSubmitting}>
              Submit
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ToggleTwoFactorAuth;
