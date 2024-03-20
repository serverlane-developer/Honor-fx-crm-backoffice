import React, { useEffect, useState } from "react";

import { Form, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../../components/Title";

import Constants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import AdminForm from "../AdminForm";
import Loader from "../../../components/Loader";

const UpdateAdmin = () => {
  const { userid } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  // const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onFinish = async (values) => {
    const endpoint = Constants.UPDATE_ADMIN;
    const url = `${Constants.BASE_URL}${endpoint.url}/${userid}`;
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
      const errMessage = "Error while updating admin";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!userid) {
      message.error("Admin ID is required to Update an Admin User");
      navigate("/admin/view", { replace: true });
      return;
    }

    const getAdminById = async () => {
      try {
        setIsLoading(true);
        const endpoint = Constants.GET_ADMIN_BY_ID;
        const url = `${Constants.BASE_URL}${endpoint.url}/${userid}`;
        const res = await callApi(endpoint.method, url);
        const data = res?.data?.data;
        const admin = data?.user;
        // setUserData({ ...admin });
        const fields = { email: admin.email, username: admin.username, role_id: admin.role_id };
        form.setFieldsValue(fields);
      } catch (error) {
        const errMessage = "Error while fetching admin";
        console.error(errMessage, error);
        message.error(getAxiosError(error) || errMessage);
      } finally {
        setIsLoading(false);
      }
    };

    getAdminById();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, userid]);

  return (
    <div>
      <Title title="Update Admin User" />
      {isLoading ? (
        <Loader message="Loading Admin Details..." />
      ) : (
        <AdminForm form={form} isSubmitting={isSubmitting} onFinish={onFinish} isUpdate />
      )}
    </div>
  );
};

export default UpdateAdmin;
