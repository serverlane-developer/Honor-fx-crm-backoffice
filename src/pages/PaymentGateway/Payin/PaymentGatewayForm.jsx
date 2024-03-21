/* eslint-disable react/forbid-prop-types */
import React from "react";
import propTypes from "prop-types";
import { Button, Card, Form, Input, Row, Select } from "antd";
import { PayoutArr, PayoutFields } from "./PayoutFields";

const PaymentGatewayForm = ({ form, onFinish, isSubmitting }) => {
  const pg_service = Form.useWatch("pg_service", form);

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 8,
    },
  };
  const pgServices = PayoutArr.map((x) => ({ label: x, value: x }));

  return (
    <Card>
      <Form
        {...layout}
        form={form}
        size="large"
        name="create-role"
        autoComplete="off"
        onFinish={onFinish}
        disabled={isSubmitting}
        initialValues={{
          imps_min: 1,
          imps_max: 2,
          neft_min: 1,
          neft_max: 2,
          rtgs_min: 1,
          rtgs_max: 2,
        }}
      >
        <Form.Item
          label="Label"
          name="pg_label"
          rules={[
            {
              required: true,
            },
            {
              min: 3,
            },
            {
              max: 50,
            },
          ]}
        >
          <Input autoFocus placeholder="Enter name to show in Transaction Receipt" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="Nickname"
          name="nickname"
          rules={[
            {
              required: true,
            },
            {
              min: 3,
            },
            {
              max: 50,
            },
          ]}
        >
          <Input placeholder="Gateway name for Internal Admin Reference" autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="PG Service"
          name="pg_service"
          rules={[{ required: true, message: "Pg Service is required for Creation" }]}
        >
          <Select placeholder="Payment Gateway" options={pgServices} />
        </Form.Item>

        <PayoutFields pg_service={pg_service} />

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
PaymentGatewayForm.propTypes = {
  form: propTypes.object.isRequired,
  onFinish: propTypes.func.isRequired,
  isSubmitting: propTypes.bool.isRequired,
  isUpdate: propTypes.bool,
};
PaymentGatewayForm.defaultProps = {
  isUpdate: false,
};

export default PaymentGatewayForm;
