/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from "react";
import lo, { cloneDeep, groupBy } from "lodash";
import propTypes from "prop-types";
import { Button, Card, Checkbox, Col, Form, Input, Row, message } from "antd";

import Constants from "../../config/apiConstants";
import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";
import Loader from "../../components/Loader";

const getGroupedModules = (modules = [], accessRights = []) => {
  const groupedModules = groupBy(modules, "module_id");
  const keys = Object.keys(groupedModules);

  const modulesArr = [];
  for (let i = 0; i < keys.length; i += 1) {
    const moduleId = keys[i];
    const submodules = groupedModules[moduleId];
    const module = submodules[0];
    const moduleObj = {
      module_id: moduleId,
      label: module.module_label,
      children: submodules.map((submodule) => {
        const assignedSubmodule = lo.find(accessRights, (x) => x.submodule_id === submodule.submodule_id);
        let canCreate = false;
        let canRead = false;
        let canUpdate = false;
        let canDelete = false;

        if (assignedSubmodule) {
          canCreate = assignedSubmodule?.can_create;
          canRead = assignedSubmodule?.can_read;
          canUpdate = assignedSubmodule?.can_update;
          canDelete = assignedSubmodule?.can_delete;
        }
        const subModuleChecked = canCreate && canRead && canUpdate && canDelete;
        return {
          label: submodule.submodule_label,
          submodule_id: submodule.submodule_id,
          can_create: canCreate,
          can_read: canRead,
          can_update: canUpdate,
          can_delete: canDelete,
          submodule_checked: subModuleChecked,
        };
      }),
    };
    modulesArr.push(moduleObj);
  }
  return modulesArr;
};

const RoleForm = ({ form, onFinish, isSubmitting, role }) => {
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [submodules, setSubmodules] = useState([]);
  const [modules, setModules] = useState([]);

  const getModules = async () => {
    const endpoint = Constants.GET_SUBMODULES_FOR_ROLE_ASSIGNMENT;
    const url = Constants.BASE_URL + endpoint.url;
    try {
      setIsLoading(true);
      const { data: resData } = await callApi(endpoint.method, url);
      const { status, message: resMessage, data } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }
      const submoduleRes = data?.submodules || [];
      setSubmodules(submoduleRes);
      const groupedModules = getGroupedModules(submoduleRes, role?.access_rights);
      setModules(groupedModules);
      form.setFieldsValue({ modules: groupedModules, role_name: role?.role_name || "" });
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while getting modules for dropdown";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getModules();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 8,
    },
  };

  const onSubmoduleCheck = (e) => {
    const { id, checked } = e.target;
    const ids = id.split("_");
    const [, , mi, , smi] = ids;
    const currModules = cloneDeep(form.getFieldValue("modules"));
    const currSubmodule = currModules[mi].children[smi];
    currModules[mi].children[smi] = {
      ...currSubmodule,
      can_create: checked,
      can_read: checked,
      can_update: checked,
      can_delete: checked,
      submodule_checked: checked,
    };
    form.setFieldValue("modules", currModules);
  };

  const onRightCheck = (e) => {
    const { id, checked } = e.target;
    const ids = id.split("_");
    const [, , mi, , smi, , name] = ids;
    const currModules = cloneDeep(form.getFieldValue("modules"));
    const currSubmodule = currModules[mi].children[smi];
    currModules[mi].children[smi] = {
      ...currSubmodule,
      [`can_${name}`]: checked,
    };
    const { can_create: canCreate, can_read: canRead, can_update: canUpdate, can_delete: canDelete } = currSubmodule;
    const submoduleChecked = canCreate && canRead && canUpdate && canDelete;
    currModules[mi].children[smi].submodule_checked = submoduleChecked;
    form.setFieldValue("modules", currModules);
  };

  if (isLoading) return <Loader message="Loading Modules for Role Assignment" />;

  return (
    <Card>
      <Form
        form={form}
        size="large"
        name="create-role"
        autoComplete="off"
        onFinish={onFinish}
        disabled={isLoading || isSubmitting}
      >
        <Form.Item
          {...layout}
          label="Role name"
          name="role_name"
          rules={[
            {
              required: true,
              message: `Please enter a Role Name!`,
            },
            {
              min: 3,
              message: `Role name should be atleast 3 Letters`,
            },
            {
              max: 25,
              message: `Role name should be less than 25 Letters`,
            },
          ]}
        >
          <Input placeholder="Enter Role Name" />
        </Form.Item>

        <Form.List name="modules">
          {(fields) => (
            <div
              style={{
                display: "flex",
                rowGap: 16,
                flexDirection: "column",
              }}
            >
              {fields.map((field, mi) => (
                <Card size="small" title={`${mi + 1}. ${modules[mi].label}`} key={field.key}>
                  <Form.List name={[field.name, "children"]}>
                    {(subFields) =>
                      subFields.map((subField, smi) => (
                        <Row key={subField.key} align="middle">
                          <Col span={6} offset={2}>
                            <Form.Item
                              label={modules[mi].children[smi].label}
                              hidden
                              name={[subField.name, "submodule_id"]}
                            >
                              <Input />
                            </Form.Item>
                            {/* <div>
                            </div> */}
                            <Form.Item
                              label={`${smi + 1}. ${modules[mi].children[smi].label}`}
                              name={[subField.name, "submodule_checked"]}
                              valuePropName="checked"
                            >
                              <Checkbox onChange={onSubmoduleCheck} />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item label="Can Create" name={[subField.name, "can_create"]} valuePropName="checked">
                              <Checkbox onChange={onRightCheck} />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item label="Can read" name={[subField.name, "can_read"]} valuePropName="checked">
                              <Checkbox onChange={onRightCheck} />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item label="Can update" name={[subField.name, "can_update"]} valuePropName="checked">
                              <Checkbox onChange={onRightCheck} />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item label="Can delete" name={[subField.name, "can_delete"]} valuePropName="checked">
                              <Checkbox onChange={onRightCheck} />
                            </Form.Item>
                          </Col>
                        </Row>
                      ))
                    }
                  </Form.List>
                </Card>
              ))}
            </div>
          )}
        </Form.List>

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
RoleForm.propTypes = {
  form: propTypes.object.isRequired,
  onFinish: propTypes.func.isRequired,
  isSubmitting: propTypes.bool.isRequired,
  role: propTypes.object,
};
RoleForm.defaultProps = {
  role: null
};

export default RoleForm;
