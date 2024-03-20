import React, { useState } from "react";
import { Alert, Button, Card, Form, Input, Row, message } from "antd";
import { Content } from "antd/es/layout/layout";

import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Constants from "../../config/apiConstants";
import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";
import isGuest from "../../components/hoc/isGuest";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPassword = async (values) => {
    const endpoint = Constants.ADMIN_FORGOT_PASSWORD;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      setIsSubmitting(true);
      setError("");
      const { data: resData } = await callApi(endpoint.method, url, values);
      const { status, message: resMessage } = resData;
      if (!status) {
        setError(resMessage);
        return;
      }
      message.success(resMessage);
      navigate("/login", { replace: true });
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while setting Reset password Link";
      console.error(errMessage, err, axiosError);
      setError(axiosError || errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div key="password-form">
            <h2>Forgot Password?</h2>
            <p className="text-medium-emphasis">Enter Email and Receive a link to Reset your Password</p>
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
              onFinish={handleForgotPassword}
              autoComplete="off"
            >
              <Form.Item
                label="Email ID"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Email ID!",
                  },
                ]}
              >
                <Input placeholder="Enter Email ID" autoFocus type="email" autoComplete="email" />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
                style={{ marginTop: 40 }}
              >
                <Button type="primary" htmlType="submit" size="large" loading={isSubmitting}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Row align="middle" justify="end">
            <Link to="/login">Back to Login</Link>
          </Row>
        </Card>
      </Row>
    </Content>
  );
};

export default isGuest(ForgotPassword);
