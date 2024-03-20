import React, { useState } from "react";
import { Alert, Button, Card, Form, Input, Row, message } from "antd";
import { Content } from "antd/es/layout/layout";

import { Navigate, useNavigate } from "react-router";
import { Link, useSearchParams } from "react-router-dom";
import Constants from "../../config/apiConstants";
import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";
import isGuest from "../../components/hoc/isGuest";

const ResetPassword = () => {
  const [params] = useSearchParams();
  let resetToken = params.get("reset_token");
  let email = params.get("email");

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!resetToken || !email) return <Navigate to="/login" replace />;
  resetToken = decodeURIComponent(resetToken);
  email = decodeURIComponent(email);

  const handleResetPassword = async (values) => {
    const endpoint = Constants.ADMIN_RESET_PASSWORD;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      setIsSubmitting(true);
      setError("");
      const { data: resData } = await callApi(endpoint.method, url, { ...values, reset_token: resetToken, email });
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
            <h2>Reset Password?</h2>
            <p className="text-medium-emphasis">Enter a new Password</p>
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
              onFinish={handleResetPassword}
              autoComplete="off"
            >
              <Input type="email" name="email" autoComplete="email" hidden value={email} />

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password!",
                  },
                ]}
              >
                <Input.Password placeholder="Enter a New Password" autoComplete="new-password" />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="cnf_password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("The new password that you entered do not match!"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" autoComplete="new-password" />
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

          <Row align="middle" justify="space-between">
            <Link to="/login">Back to Login</Link>
            <Link to="/forgot-password">Forgot Password</Link>
          </Row>
        </Card>
      </Row>
    </Content>
  );
};

export default isGuest(ResetPassword);
