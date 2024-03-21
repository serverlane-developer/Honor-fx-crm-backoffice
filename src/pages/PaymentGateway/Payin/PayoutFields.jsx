import React from "react";
import propTypes from "prop-types";
import { Form, Input } from "antd";
import { splitAndCapitalise } from "../../../helpers/functions";

const inputConfig = {
  PAYDUNIA: {
    base_url_alt: {
      placeholder: "PAYDUNIA STATUS URL",
      type: "url",
    },
    merchant_id: {
      placeholder: "PAYDUNIA MERCHANT ID",
      type: "password",
    },
    secret_key: {
      placeholder: "PAYDUNIA SECRET KEY",
      type: "password",
    },
    username: {
      placeholder: "PAYDUNIA USERNAME",
      type: "password",
    },
    password: {
      placeholder: "PAYDUNIA PASSWORD",
      type: "password",
    },
  },
};

const PayoutArr = Object.keys(inputConfig);

const PayoutFields = ({ pg_service }) => {
  const fields = inputConfig[pg_service];
  if (!fields) return null;
  const fieldArr = Object.keys(fields);

  return (
    <>
      <Form.Item
        key={`${pg_service}_base_url`}
        label="Base URL"
        name="base_url"
        rules={[
          {
            required: true,
            message: "Base URL is required",
          },
          {
            type: "url",
            message: "Base URL must be a valid url.",
          },
        ]}
      >
        <Input placeholder="Payment Gateway Base URL" autoComplete="off" type="url" />
      </Form.Item>
      {fieldArr.map((f) => (
        <Form.Item label={splitAndCapitalise(f)} name={f} rules={[{ required: true }]} key={`${pg_service}_${f}}`}>
          {fields[f].type === "password" ? (
            <Input.Password placeholder={fields[f].placeholder} autoComplete="off" />
          ) : (
            <Input type={fields[f].type} placeholder={fields[f].placeholder} autoComplete="off" />
          )}
        </Form.Item>
      ))}
      <Form.Item label="Description" name="description" key={`${pg_service}_desc}`}>
        <Input placeholder="Description for Internal Reference" autoComplete="off" />
      </Form.Item>
    </>
  );
};
PayoutFields.propTypes = {
  pg_service: propTypes.string,
};
PayoutFields.defaultProps = {
  pg_service: "",
};

export { PayoutFields, PayoutArr };
