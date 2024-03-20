import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Alert, Button, Card, Form, Input, message, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import { Link, useNavigate } from "react-router-dom";

import Constants from "../../config/apiConstants";
import callApi from "../../helpers/NetworkHelper";
import { setLoginData } from "../../reducers/login";
import getAxiosError from "../../helpers/getAxiosError";
import isGuest from "../../components/hoc/isGuest";
import jwtHelper from "../../helpers/jwt";

const Login = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleToken = (data = {}) => {
    jwtHelper.handleJwt(data);
    dispatch(setLoginData(data));
    message.success("Login Successful");
    setIsLoggedIn(true);
    navigate(`/home`, { replace: true });
  };

  const handleLoginSubmit = async (values) => {
    const endpoint = Constants.LOGIN;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      const { data: resData, headers } = await callApi(endpoint.method, url, values);
      const { status, data } = resData;
      if (status) {
        setError("");
        if (data?.otpSent) {
          setIsLoggedIn(true);
          setEmail(data?.email);
        } else {
          data.token = headers.token;
          handleToken(data);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      const axiosError = getAxiosError(err);
      console.error("Error while Sending OTP", err, axiosError);
      setError(axiosError || "Username or Password is incorrect");
      dispatch(setLoginData(null));
    }
  };

  const handleOtpSubmit = async (values) => {
    const endpoint = Constants.VERIFY_OTP;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      const { data: resData, headers } = await callApi(endpoint.method, url, { ...values, email });
      const { status, data } = resData;
      if (status) {
        data.token = headers.token;
        handleToken(data);
      } else {
        setError("Incorrect OTP");
      }
    } catch (err) {
      const axiosError = getAxiosError(err);
      console.error("Error while Submitting OTP", err);
      dispatch(setLoginData(null));
      setError(axiosError || "Incorrect OTP");
    }
  };

  const onBackClick = () => setIsLoggedIn(false);

  useEffect(() => {
    setError("");
    if (!isLoggedIn) {
      setEmail("");
    }
  }, [isLoggedIn]);

  return (
    <Content
      style={{
        height: "100vh",
        overflow: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "whitesmoke",
      }}
    >
      {error && <Alert message="Error" description={error} type="error" showIcon />}

      <Row justify="center" style={{ paddingTop: 32 }}>
        <Card bordered={false}>
          {!isLoggedIn ? (
            <div key="password-form">
              <h1>Login</h1>
              <p className="text-medium-emphasis">Sign In to your account</p>
              <Form
                size="large"
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={handleLoginSubmit}
                autoComplete="off"
              >
                <Form.Item
                  label="Email ID"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input placeholder="Enter Email" autoFocus type="email" autoComplete="email" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter Password" autoComplete="password" />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button type="primary" htmlType="submit" size="large">
                    Send OTP
                  </Button>
                </Form.Item>
              </Form>
              <Row align="middle" justify="end">
                <Link to="/forgot-password">Forgot Password</Link>
              </Row>
            </div>
          ) : (
            <div key="otp-form">
              <h1>Verify</h1>
              <p className="text-medium-emphasis">Enter OTP</p>
              <Form
                size="large"
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={handleOtpSubmit}
                autoComplete="off"
              >
                <Form.Item
                  label="OTP"
                  name="token"
                  rules={[
                    {
                      required: true,
                      message: "Please input your OTP!",
                    },
                    {
                      pattern: /^\d{6,6}$/,
                      message: "Should be a 6 Digit Number",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter OTP"
                    autoFocus
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{6}"
                  />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button type="link" size="large" onClick={onBackClick}>
                    Back
                  </Button>
                  <Button type="primary" htmlType="submit" size="large">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
        </Card>
      </Row>
    </Content>
  );
};

export default isGuest(Login);
