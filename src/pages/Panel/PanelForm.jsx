/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from "react";

import propTypes from "prop-types";
import { Button, Card, Form, Input, InputNumber, Row, Select, message } from "antd";

import Constants from "../../config/apiConstants";
import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";

const PanelForm = ({ form, onFinish, isSubmitting, initialValues, isUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [pgList, setPgList] = useState([]);

  const isWithdrawPanel = Form.useWatch("panel_type", form) === "withdraw";

  const panelTypes = [
    {
      label: "Withdraw",
      value: "withdraw",
    },
    {
      label: "Deposit",
      value: "deposit",
    },
  ];

  const getAdminUsers = async () => {
    try {
      const endpoint = Constants.GET_ADMINS;
      const url = Constants.BASE_URL + endpoint.url;
      const response = await callApi(endpoint.method, url);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getPgList = async () => {
    try {
      const endpoint = Constants.GET_PG_DROPDOWN_FOR_PANEL;
      const url = Constants.BASE_URL + endpoint.url;
      const response = await callApi(endpoint.method, url);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getAdminUsers()
      .then((res) => {
        let usersList = res?.data?.data?.users || [];
        usersList = usersList.map((obj) => ({ ...obj, value: obj.user_id, label: `${obj.username} • ${obj.email}` }));
        setAdminUsers(usersList);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(getAxiosError(error) || "Error while fetching admin users");
        setIsLoading(false);
      });
    getPgList()
      .then((res) => {
        const pgListRes = res?.data?.data || [];
        // pgListRes = pgListRes.map((obj) => ({
        //   ...obj,
        //   value: obj.pg_id,
        //   label: `${obj.pg_label} • ${obj.pg_service} • ${obj.nickname}`,
        // }));
        // console.log("pgList", pgListRes);
        setPgList(pgListRes);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(getAxiosError(error) || "Error while fetching admin users");
        setIsLoading(false);
      });
    // form.setFieldValue("module_id", undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        name="create-panel"
        autoComplete="off"
        onFinish={onFinish}
        initialValues={initialValues}
        disabled={isLoading || isSubmitting}
      >
        <Form.Item
          label="Panel name"
          name="panel_name"
          rules={[
            {
              required: true,
              message: `Please enter a Panel Name!`,
            },
            {
              min: 3,
              message: `panel name should be atleast 3 Letters`,
            },
            {
              max: 25,
              message: `panel name should be less than 25 Letters`,
            },
          ]}
        >
          <Input placeholder="Enter Panel Name" />
        </Form.Item>
        <Form.Item
          label="Panel Type"
          name="panel_type"
          rules={[{ required: true, message: "Panel should be either Deposit or Withdraw" }]}
        >
          <Select placeholder="Is this a Deposit or Withdraw Panel?" options={panelTypes} disabled={isUpdate} />
        </Form.Item>

        <Form.Item
          label="Panel url"
          name="panel_url"
          rules={[
            {
              required: true,
              message: `Please enter a Panel url!`,
            },
            {
              min: 3,
              message: `panel url should be atleast 3 Letters`,
            },
          ]}
        >
          <Input placeholder="Enter Panel Name" />
        </Form.Item>

        <Form.Item
          label="Agent username"
          name="agent_username"
          disabled
          rules={[
            {
              required: true,
              message: `Please enter a Agent username!`,
            },
            {
              min: 3,
              message: `Agent username should be atleast 3 Letters`,
            },
            {
              max: 25,
              message: `Agent username should be less than 25 Letters`,
            },
          ]}
        >
          <Input placeholder="Enter Agent Username" />
        </Form.Item>
        <Form.Item
          label="Agent password"
          name="agent_password"
          disabled
          rules={[
            {
              required: true,
              message: `Please enter a Agent password!`,
            },
            {
              min: 3,
              message: `Agent password should be atleast 3 Letters`,
            },
            {
              max: 25,
              message: `Agent password should be less than 25 Letters`,
            },
          ]}
        >
          <Input placeholder="Enter Agent Password" />
        </Form.Item>

        {/* <Form.Item label="Is Rpa" name="is_rpa_enabled" valuePropName="checked">
          <Switch disabled />
        </Form.Item> */}

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: false,
              message: `Please enter a description!`,
            },
          ]}
        >
          <Input placeholder="Enter Admin Password" />
        </Form.Item>

        <Form.Item
          label="Assign admin"
          name="assigned_users"
          rules={[{ required: false, message: "Module is required to create a Submodule" }]}
        >
          <Select
            mode="multiple"
            placeholder={isLoading ? "Loading Admin" : "Select a Admin"}
            loading={isLoading}
            options={adminUsers}
            disabled={isLoading}
          />
        </Form.Item>

        {isWithdrawPanel && (
          <Form.Item
            label="Payment Gateway"
            name="pg_id"
            rules={[{ required: true, message: "Payment gateway is required" }]}
          >
            <Select
              placeholder={isLoading ? "Loading Payment Gateway" : "Select a Payment Gateway"}
              loading={isLoading}
              options={pgList}
              disabled={isLoading}
            />
          </Form.Item>
        )}

        {!isWithdrawPanel && (
          <Form.Item
            label="Reject Deposit After (Minutes)"
            name="reject_deposit_after"
            rules={[
              {
                required: true,
                message: "Required",
              },
            ]}
          >
            <InputNumber placeholder="Minutes values to Reject Deposit after" min={1} defaultValue={3} />
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
PanelForm.propTypes = {
  form: propTypes.object.isRequired,
  isUpdate: propTypes.bool.isRequired,
  onFinish: propTypes.func.isRequired,
  isSubmitting: propTypes.bool.isRequired,
  initialValues: propTypes.object,
};
PanelForm.defaultProps = {
  initialValues: {
    reject_deposit_after: 3
  },
  // module: null,
};

export default PanelForm;
