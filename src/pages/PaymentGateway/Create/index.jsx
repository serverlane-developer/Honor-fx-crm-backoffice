import React, { useState } from "react";

import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import Title from "../../../components/Title";

import Constants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import PaymentGatewayForm from "../PaymentGatewayForm";

const CreatePaymentGateway = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    const endpoint = Constants.CREATE_PAYMENT_GATEWAY;
    const url = `${Constants.BASE_URL}${endpoint.url}`;
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
      navigate("/paymentgateway/view", { replace: true });
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while updating payment gateway";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Title title="Create Payment Gateway" />
      <PaymentGatewayForm form={form} isSubmitting={isSubmitting} onFinish={onFinish} />
    </div>
  );
};

export default CreatePaymentGateway;
