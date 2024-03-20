import React, { useEffect, useState } from "react";

import { Form, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../../components/Title";

import Constants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import PanelForm from "../PanelForm";
import Loader from "../../../components/Loader";
// import { getModuleName } from "../../../helpers/functions";

const UpdatePanel = () => {
  const { panelid } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  // const [moduleData, setModuleData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [panelData, setPanelData] = useState(null);

  const getModuleById = async () => {
    try {
      setIsLoading(true);
      const endpoint = Constants.GET_PANEL_BY_ID;
      const url = `${Constants.BASE_URL}${endpoint.url}/${panelid}`;
      const res = await callApi(endpoint.method, url);
      const data = res?.data?.data;
      // const module = data?.module;
      setPanelData(data);
      form.setFieldsValue({
        ...data,
      });
    } catch (error) {
      const errMessage = "Error while fetching module";
      console.error(errMessage, error);
      message.error(getAxiosError(error) || errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onFinish = async (values) => {
    const endpoint = Constants.UPDATE_PANEL;
    const url = `${Constants.BASE_URL}${endpoint.url}/${panelid}`;
    try {
      setIsSubmitting(true);
      values.is_deleted = panelData.is_deleted;
      const { data: resData } = await callApi(endpoint.method, url, values);
      const { status, message: resMessage } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }
      form.resetFields();
      message.success(resMessage);
      navigate("/panel/view", { replace: true });
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while creating module";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!panelid) {
      message.error("Panel ID is required to Update a Module");
      navigate("/panel/view", { replace: true });
      return;
    }
    getModuleById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div>
        <Title title="Update Panel" />
        <Loader message="Loading Panel Details..." />
      </div>
    );
  }

  return (
    <div>
      <Title title="Update Panel" />
      <PanelForm
        form={form}
        formType="update"
        isSubmitting={isSubmitting}
        onFinish={onFinish}
        initialValues={{ is_submodule: false }}
        isUpdate
      />
    </div>
  );
};

export default UpdatePanel;
