import React, { useEffect, useState } from "react";

import { Form, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../../components/Title";

import Constants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import ModuleForm from "../ModuleForm";
import Loader from "../../../components/Loader";
import { getModuleName } from "../../../helpers/functions";

const allowedTypes = ["submodule", "module"];

const UpdateModule = () => {
  const { type, moduleid } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const isSubmodule = type === "submodule";

  const [moduleData, setModuleData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getModuleById = async () => {
    try {
      setIsLoading(true);

      const modduleEndpoint = Constants.GET_MODULE_BY_ID;
      const submodduleEndpoint = Constants.GET_SUBMODULE_BY_ID;
      const endpoint = isSubmodule ? submodduleEndpoint : modduleEndpoint;
      const url = `${Constants.BASE_URL}${endpoint.url}/${moduleid}`;
      const res = await callApi(endpoint.method, url);
      const data = res?.data?.data;
      const module = data?.module || data?.submodule;
      setModuleData({ ...module });
      if (isSubmodule) {
        form.setFieldsValue({
          module_id: module.module_id,
          submodule_name: getModuleName(module.submodule_name),
          is_submodule: true,
        });
      } else {
        form.setFieldsValue({
          module_name: getModuleName(module.module_name),
          is_submodule: false,
        });
      }
    } catch (error) {
      const errMessage = "Error while fetching module";
      console.error(errMessage, error);
      message.error(getAxiosError(error) || errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onFinish = async (values) => {
    const modduleEndpoint = Constants.UPDATE_MODULE;
    const submodduleEndpoint = Constants.UPDATE_SUBMODULE;
    const endpoint = isSubmodule ? submodduleEndpoint : modduleEndpoint;
    const url = `${Constants.BASE_URL}${endpoint.url}/${moduleid}`;
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
      navigate("/modules/view", { replace: true });
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
    if (!allowedTypes.includes(type)) {
      message.error(`Type should be one of ${allowedTypes.join(", ")}`);
      navigate("/modules/view", { replace: true });
      return;
    }
    if (!moduleid) {
      message.error("Module ID is required to Update a Module");
      navigate("/modules/view", { replace: true });
      return;
    }
    getModuleById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formName = isSubmodule ? "Submodule" : "Module";

  return (
    <div>
      <Title title={`Update ${formName}`} />
      {isLoading ? (
        <Loader message="Loading Module Details..." />
      ) : (
        <ModuleForm
          form={form}
          formName={formName}
          isSubmodule={!!isSubmodule}
          isSubmitting={isSubmitting}
          onFinish={onFinish}
          initialValues={{ is_submodule: false }}
          module={moduleData}
        />
      )}
    </div>
  );
};

export default UpdateModule;
