import React, { useState } from "react";

import { Form, message } from "antd";
import Title from "../../../components/Title";

import Constants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import ModuleForm from "../PanelForm";

const CreateRpaPanel = () => {
  const [form] = Form.useForm();
  const isSubmodule = Form.useWatch("is_submodule", form);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    const endpoint = Constants.CREATE_PANEL;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      setIsSubmitting(true);
      console.log('callApi', endpoint.method, url, values);
      const { data: resData } = await callApi(endpoint.method, url, values);
      const { status, message: resMessage } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }

      form.resetFields();
      message.success(resMessage);
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while creating module";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formName = isSubmodule ? "Submodule" : "Module";

  return (
    <div>
      <Title title="Create Panel" />
      <ModuleForm
        form={form}
        formName={formName}
        isSubmodule={!!isSubmodule}
        isSubmitting={isSubmitting}
        onFinish={onFinish}
        initialValues={{ is_rpa_enabled: true, reject_deposit_after: 3 }}
      />
    </div>
  );
};

export default CreateRpaPanel;
