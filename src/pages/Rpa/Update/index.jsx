import React, { useEffect, useState } from "react";
import { Row, Col, Button, Input, Space, Form, Select, Typography, Divider, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Constants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";

const ObjectEditorComp = () => {
  // console.log('*');
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();

  const getRpaObj = async () => {
    // console.log('getRpaObj called!');
    try {
      setIsLoading(true);
      const endpoint = Constants.GET_PANEL_BY_ID;
      const url = `${Constants.BASE_URL}${endpoint.url}/getDynamicRpa`;
      const res = await callApi(endpoint.method, url);
      const data = res?.data?.data;
      // console.log('data', data);
      // const module = data?.module;
      form.setFieldsValue({
        login_steps: data.login.steps,
        refresh_steps: data.refresh.steps,
        logout_steps: data.logout.steps,
        accept_steps: data.accept.steps,
        reject_steps: data.reject.steps,
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
    const newObj = {
      login: {
        steps: values.login_steps,
      },
      refresh: {
        steps: values.refresh_steps,
      },
      logout: {
        steps: values.logout_steps,
      },
      accept: {
        steps: values.accept_steps,
        toast_message: "Withdraw status updated successfully",
      },
      reject: {
        steps: values.login_steps,
        toast_message: "Withdraw status updated successfully",
      },
    };

    const endpoint = Constants.UPDATE_PANEL;
    const url = `${Constants.BASE_URL}${endpoint.url}/updateDynamicRpa`;

    try {
      // console.log('values', values);
      const { data: resData } = await callApi(endpoint.method, url, newObj);
      const { status, message: resMessage } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }
      form.resetFields();
      message.success(resMessage);
      // navigate("/modules/view", { replace: true });
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while creating module";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      // setIsSubmitting(false);
      getRpaObj();
    }
  };

  const arrayEditor = (fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Space
          key={key}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            // marginBottom: 8,
            padding: 5,
            // backgroundColor: 'red'
          }}
          align="baseline"
        >
          <Form.Item
            {...restField}
            name={[name, "element_type"]}
            label="Element Type"
            rules={[
              {
                required: true,
                message: "kindly select element!!",
              },
            ]}
          >
            <Select
              style={{
                width: 120,
              }}
              options={[
                {
                  value: "input_text",
                  label: "input_text",
                },
                {
                  value: "keyboard_press",
                  label: "keyboard_press",
                },
                {
                  value: "puppeter",
                  label: "puppeter",
                },
                {
                  value: "form",
                  label: "form",
                },
                {
                  value: "select",
                  label: "select",
                }
              ]}
            />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, "delay"]}
            label="Delay"
          >
            <Input placeholder="delay Name" />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, "query_selector"]}
            label="querySelector()"
          >
            <Input placeholder="element_id Name" />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, "data_property"]}
            label="data_property"
          >
            <Input placeholder="element_class_name Name" />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, "key_press"]}
            label="Key Press"
          >
            <Input placeholder="element_value_ref Name" />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, "wait_for_navigation"]}
            label="waitForNavigation"
          >
            <Input placeholder="element_value_ref Name" />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, "wait_until_timeout"]}
            label="waitForTimeOut"
          >
            <Input placeholder="element_value_ref Name" />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, "inner_text"]}
            label="innerText"
          >
            <Input placeholder="element_value_ref Name" />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, "action"]}
            label="Action"
          >
            <Input placeholder="element_value_ref Name" />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, "wait_for_selector"]}
            label="waitForSelector"
          >
            <Input placeholder="element_value_ref Name" />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, "value"]}
            label="Value"
          >
            <Input placeholder="element_value_ref Name" />
          </Form.Item>
          <MinusCircleOutlined onClick={() => remove(name)} />
          <Divider />
          <Divider />
          <Divider />
        </Space>
      ))}
      <Form.Item>
        <Button
          type="dashed"
          onClick={() => add()}
          block
          icon={<PlusOutlined />}
        >
          Add field
        </Button>
      </Form.Item>
    </>
  );
  useEffect(() => {
    getRpaObj();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <Row
      style={{
        marging: "100px",
        padding: "20px",
        border: "1px solid #d9d9d9",
      }}
    >
      <Col span={24}>
        <Form
          form={form}
          name="dynamic_rpa"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            login_steps: [],
            refresh_steps: [],
            logout_steps: [],
            accept_steps: [],
            reject_steps: [],
          }}
        >
          <Divider><Typography.Title level={4} style={{ margin: 0 }}>Login</Typography.Title></Divider>

          <Form.List name="login_steps" label="Login">
            {arrayEditor}
          </Form.List>

          <Divider><Typography.Title level={4} style={{ margin: 0 }}>Refresh</Typography.Title></Divider>

          <Form.List name="refresh_steps">
            {arrayEditor}
          </Form.List>

          <Divider><Typography.Title level={4} style={{ margin: 0 }}>Logout</Typography.Title></Divider>

          <Form.List name="logout_steps">
            {arrayEditor}
          </Form.List>

          <Divider><Typography.Title level={4} style={{ margin: 0 }}>Accept</Typography.Title></Divider>

          <Form.List name="accept_steps">
            {arrayEditor}
          </Form.List>

          <Divider><Typography.Title level={4} style={{ margin: 0 }}>Reject</Typography.Title></Divider>

          <Form.List name="reject_steps">
            {arrayEditor}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default ObjectEditorComp;
