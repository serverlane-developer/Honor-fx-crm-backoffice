/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from "react";

import propTypes from "prop-types";
import { Button, Card, Form, Input, Row, Select, Switch, message } from "antd";

import Constants from "../../config/apiConstants";
import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";

const ModuleForm = ({ form, formName, isSubmodule, onFinish, isSubmitting, initialValues, module }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownModules, setDropdownModules] = useState([]);

  const getModulesForDropdown = async () => {
    const endpoint = Constants.GET_MODULES_FOR_DROPDOWN;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      setIsLoading(true);
      const { data: resData } = await callApi(endpoint.method, url);
      const { status, message: resMessage, data } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }
      const modules = data?.modules || [];
      setDropdownModules(modules);
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while getting modules for dropdown";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
      form.setFieldValue("is_submodule", false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmodule === true) {
      getModulesForDropdown();
      if (module) form.setFieldValue("module_id", module?.module_id);
    } else {
      form.setFieldValue("module_id", undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmodule]);

  return (
    <Card>
      <Form
        form={form}
        size="large"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        name={`create-${formName.toLowerCase()}`}
        autoComplete="off"
        onFinish={onFinish}
        initialValues={initialValues}
        disabled={isLoading || isSubmitting}
      >
        <Form.Item
          label={`${formName} name`}
          name={`${formName.toLowerCase()}_name`}
          rules={[
            {
              required: true,
              message: `Please enter a ${formName} Name!`,
            },
            {
              min: 3,
              message: `${formName} name should be atleast 3 Letters`,
            },
            {
              max: 25,
              message: `${formName} name should be less than 25 Letters`,
            },
          ]}
        >
          <Input placeholder={`Enter ${formName} Name`} />
        </Form.Item>

        {!module && (
          <Form.Item label="Submodule" name="is_submodule" valuePropName="checked">
            <Switch disabled={isLoading || isSubmitting} />
          </Form.Item>
        )}

        {isSubmodule === true && (
          <Form.Item
            label="Parent Module"
            name="module_id"
            rules={[{ required: true, message: "Module is required to create a Submodule" }]}
          >
            <Select
              placeholder={isLoading ? "Loading Modules" : "Select a Module"}
              loading={isLoading}
              options={dropdownModules}
              disabled={isLoading}
            />
          </Form.Item>
        )}

        <Row justify="center" align="middle">
          <Form.Item style={{ marginTop: 40 }}>
            <Button type="primary" htmlType="submit" size="large" loading={isSubmitting}>
              Submit
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Card>
  );
};
ModuleForm.propTypes = {
  form: propTypes.object.isRequired,
  isSubmodule: propTypes.bool.isRequired,
  onFinish: propTypes.func.isRequired,
  isSubmitting: propTypes.bool.isRequired,
  formName: propTypes.string.isRequired,
  initialValues: propTypes.object,
  module: propTypes.object,
};
ModuleForm.defaultProps = {
  initialValues: {},
  module: null,
};

export default ModuleForm;
