/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import { Button, Card, Form, Input, Row, Select, message } from "antd";

import Constants from "../../config/apiConstants";
import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";
import Loader from "../../components/Loader";

const AdminForm = ({ form, onFinish, isSubmitting, isUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const getRoles = async () => {
    const endpoint = Constants.GET_ROLES_FOR_ADMIN_CREATION;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      setIsLoading(true);
      const { data: resData } = await callApi(endpoint.method, url);
      const { status, message: resMessage, data } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }
      const rolesRes = data?.roles || [];
      setRoles(rolesRes);
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while getting modules for dropdown";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 8,
    },
  };

  if (isLoading) return <Loader message="Loading Roles for Admin Creation" />;

  return (
    <Card>
      <Form
        {...layout}
        form={form}
        size="large"
        name="create-role"
        autoComplete="off"
        onFinish={onFinish}
        disabled={isLoading || isSubmitting}
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
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: `Please enter a User Name!`,
            },
            {
              min: 3,
              message: `User name should be atleast 3 Letters`,
            },
            {
              max: 25,
              message: `User name should be less than 25 Letters`,
            },
          ]}
        >
          <Input placeholder="Enter Username" autoComplete="off" />
        </Form.Item>

        {!isUpdate && (
          <>
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
          </>
        )}
        <Form.Item
          label="Role"
          name="role_id"
          rules={[{ required: true, message: "Role is required to create an admin user" }]}
        >
          <Select
            placeholder={isLoading ? "Loading Roles" : "Select a Role"}
            loading={isLoading}
            options={roles}
            disabled={isLoading}
          />
        </Form.Item>

        <Row justify="center" align="middle">
          <Form.Item style={{ marginTop: 40 }}>
            <Button type="primary" htmlType="submit" size="large" loading={isSubmitting}>
              Submit
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Card>
  );
};
AdminForm.propTypes = {
  form: propTypes.object.isRequired,
  onFinish: propTypes.func.isRequired,
  isSubmitting: propTypes.bool.isRequired,
  isUpdate: propTypes.bool,
};
AdminForm.defaultProps = {
  isUpdate: false,
};

export default AdminForm;
