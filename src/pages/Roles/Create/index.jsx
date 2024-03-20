import React, { useState } from "react";

import { Form, message } from "antd";
import Title from "../../../components/Title";

import Constants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import RoleForm from "../RoleForm";

const getAccessDetails = (modules = []) => {
  const accessDetails = [];
  for (let i = 0; i < modules.length; i += 1) {
    const moduleData = modules[i];
    const submodules = moduleData?.children || [];
    if (submodules.length) {
      for (let j = 0; j < submodules.length; j += 1) {
        const submodule = submodules[j] || {};
        const { can_create: canCreate, can_read: canRead, can_update: canUpdate, can_delete: canDelete } = submodule;
        if (canCreate || canRead || canUpdate || canDelete) {
          const accessObj = submodule;
          delete submodule.label;
          delete submodule.submodule_checked;
          accessDetails.push(accessObj);
        }
      }
    }
  }
  return accessDetails;
};

const CreateRole = () => {
  const [form] = Form.useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    const endpoint = Constants.CREATE_ROLE;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      setIsSubmitting(true);
      const accessDetails = getAccessDetails(values.modules);
      const body = {
        role_name: values?.role_name,
        access_detail: accessDetails,
      };
      const { data: resData } = await callApi(endpoint.method, url, body);
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

  return (
    <div>
      <Title title="Create Role" />
      <RoleForm form={form} isSubmitting={isSubmitting} onFinish={onFinish} />
    </div>
  );
};

export default CreateRole;
