import React, { useEffect, useState } from "react";

import { Form, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../../components/Title";

import Constants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import RoleForm from "../RoleForm";
import Loader from "../../../components/Loader";

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

const UpdateRole = () => {
  const { roleid } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleData, setRoleDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getRoleById = async () => {
    try {
      setIsLoading(true);
      const endpoint = Constants.GET_ROLE_BY_ID;
      const url = `${Constants.BASE_URL}${endpoint.url}/${roleid}`;
      const res = await callApi(endpoint.method, url);
      const role = res?.data?.data?.role;
      setRoleDate({ ...role });
    } catch (error) {
      const errMessage = "Error while fetching profile info";
      console.error(errMessage, error);
      message.error(getAxiosError(error) || errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onFinish = async (values) => {
    const endpoint = Constants.UPDATE_ROLE;
    const url = `${Constants.BASE_URL}${endpoint.url}/${roleid}`;
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
      navigate("/roles/view", { replace: true });
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
    if (!roleid) {
      message.error("Role ID is required to Update a Role");
      navigate("/roles/view", { replace: true });
      return;
    }
    getRoleById();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Title title="Update Role" />
      {isLoading ? (
        <Loader message="Loading Role Details..." />
      ) : (
        <RoleForm form={form} isSubmitting={isSubmitting} onFinish={onFinish} role={roleData} />
      )}
    </div>
  );
};

export default UpdateRole;
