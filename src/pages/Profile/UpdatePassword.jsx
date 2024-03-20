import React, { useState } from "react";

import { Button, Form, Input, message, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import propTypes from "prop-types";

import Constants from "../../config/apiConstants";
import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";
import CookieHelper from "../../helpers/CookieHelper";
import { setLoginData } from "../../reducers/login";

const UpdatePassword = ({ isModal }) => (isModal ? <UpdatePasswordModal /> : <UpdatePasswordForm />);
UpdatePassword.propTypes = {
  isModal: propTypes.bool,
};
UpdatePassword.defaultProps = {
  isModal: false,
};

const UpdatePasswordModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const onClose = () => setIsVisible(false);
  const onOpen = () => setIsVisible(true);

  return (
    <div>
      {isVisible && (
        <Modal title="Update password" open={isVisible} onCancel={onClose} footer={null} centered>
          <UpdatePasswordForm onSuccess={onClose} />
        </Modal>
      )}
      <Button type="primary" onClick={onOpen} size="large">
        Update Password
      </Button>
    </div>
  );
};

const UpdatePasswordForm = ({ onSuccess }) => {
  const loginData = useSelector((state) => state?.login?.data);
  const [email] = useState(loginData?.email);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const endpoint = Constants.ADMIN_UPDATE_PASSWORD;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      setIsSubmitting(true);
      const { data: resData } = await callApi(endpoint.method, url, values);
      const { status, message: resMessage } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }

      const cookieHelper = new CookieHelper();
      cookieHelper.setCookie("", null, -365);
      dispatch(setLoginData(null));
      message.success(resMessage);
      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while setting Reset password Link";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      size="large"
      labelCol={{
        span: 10,
      }}
      wrapperCol={{
        span: 14,
      }}
      name="update-password"
      onFinish={onFinish}
    >
      <Input type="email" name="email" autoComplete="email" value={email} hidden />

      <Form.Item
        label="Password"
        name="old_password"
        rules={[
          {
            required: true,
            message: "Please enter your current password!",
          },
        ]}
      >
        <Input.Password placeholder="Enter Current Password" autoComplete="current-password" />
      </Form.Item>

      <Form.Item
        label="New Password"
        name="new_password"
        rules={[
          {
            required: true,
            message: "Please enter a New password!",
          },
        ]}
      >
        <Input.Password placeholder="Enter a New Password" autoComplete="new-password" />
      </Form.Item>

      <Form.Item
        label="Confirm New Password"
        name="cnf_password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your New password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("new_password") === value) {
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
  );
};
UpdatePasswordForm.propTypes = {
  onSuccess: propTypes.func,
};

UpdatePasswordForm.defaultProps = {
  onSuccess: () => {},
};

export default UpdatePassword;
