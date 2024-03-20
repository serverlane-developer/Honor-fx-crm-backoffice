import React, { useState } from "react";

import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import Title from "../../../components/Title";

import Constants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import AdminForm from "../AdminForm";

const CreateAdmin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    const endpoint = Constants.CREATE_ADMIN;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      setIsSubmitting(true);
      const { data: resData } = await callApi(endpoint.method, url, values);
      const { status, message: resMessage } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }
      form.resetFields();
      message.success(resMessage);
      navigate("/admin/view", { replace: true });
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while creating admin user";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Title title="Create Admin" />
      <AdminForm form={form} isSubmitting={isSubmitting} onFinish={onFinish} />
    </div>
  );
};

export default CreateAdmin;
