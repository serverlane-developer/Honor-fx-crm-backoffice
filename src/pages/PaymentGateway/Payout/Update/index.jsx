import React, { useEffect, useState } from "react";

import { Form, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../../../components/Title";

import Constants from "../../../../config/apiConstants";
import callApi from "../../../../helpers/NetworkHelper";
import getAxiosError from "../../../../helpers/getAxiosError";
import PaymentGatewayForm from "../PaymentGatewayForm";
import Loader from "../../../../components/Loader";

const UpdatePaymentGateway = () => {
  const { pgid } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  // const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onFinish = async (values) => {
    const endpoint = Constants.UPDATE_PAYOUT_GATEWAY;
    const url = `${Constants.BASE_URL}${endpoint.url}/${pgid}`;
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

  useEffect(() => {
    if (!pgid) {
      message.error("Payment Gateway ID is required");
      navigate("/paymentgateway/view", { replace: true });
      return;
    }

    const getPaymentGatewayById = async () => {
      try {
        setIsLoading(true);
        const endpoint = Constants.GET_PAYOUT_GATEWAY_BY_ID;
        const url = `${Constants.BASE_URL}${endpoint.url}/${pgid}`;
        const res = await callApi(endpoint.method, url);
        const data = res?.data?.data;
        form.setFieldsValue({ ...data });
      } catch (error) {
        const errMessage = "Error while fetching payment gateway";
        console.error(errMessage, error);
        message.error(getAxiosError(error) || errMessage);
      } finally {
        setIsLoading(false);
      }
    };

    getPaymentGatewayById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, pgid]);

  return (
    <div>
      <Title title="Update Payment Gateway" />
      {isLoading ? (
        <Loader message="Loading Payment Gateway Details..." />
      ) : (
        <PaymentGatewayForm form={form} isSubmitting={isSubmitting} onFinish={onFinish} isUpdate />
      )}
    </div>
  );
};

export default UpdatePaymentGateway;
