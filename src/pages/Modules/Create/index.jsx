import React, { useState } from "react";

import { Form, message } from "antd";
import Title from "../../../components/Title";

import Constants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import ModuleForm from "../ModuleForm";

const CreateModule = () => {
  const [form] = Form.useForm();
  const isSubmodule = Form.useWatch("is_submodule", form);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    const modduleEndpoint = Constants.CREATE_MODULE;
    const submodduleEndpoint = Constants.CREATE_SUBMODULE;
    const endpoint = isSubmodule ? submodduleEndpoint : modduleEndpoint;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      setIsSubmitting(true);
      const { data: resData } = await callApi(endpoint.method, url, values);
      const { status, message: resMessage } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }

      if (isSubmodule) {
        form.setFieldsValue({
          module_id: "",
          submodule_name: "",
        });
      } else {
        form.resetFields();
      }
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
      <Title title={`Create ${formName}`} />
      <ModuleForm
        form={form}
        formName={formName}
        isSubmodule={!!isSubmodule}
        isSubmitting={isSubmitting}
        onFinish={onFinish}
        initialValues={{ is_submodule: false }}
      />
    </div>
  );
};

export default CreateModule;
