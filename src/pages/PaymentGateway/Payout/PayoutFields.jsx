import React from "react";
import propTypes from "prop-types";
import { Form, Input } from "antd";
import { splitAndCapitalise } from "../../../helpers/functions";

const inputConfig = {
  CASHFREE: {
    client_id: {
      placeholder: "CASHFREE CLIENT ID",
      type: "password",
    },
    secret_key: {
      placeholder: "CASHFREE SECRET KEY",
      type: "password",
    },
  },
  QIKPAY: {
    merchant_id: {
      placeholder: "QIKPAY TOKEN",
      type: "password",
    },
    secret_key: {
      placeholder: "QIKPAY HKEY",
      type: "password",
    },
  },
  EASYPAYMENTZ: {
    merchant_id: {
      placeholder: "EASYPAYMENTZ MERCHANT ID",
      type: "password",
    },
    secret_key: {
      placeholder: "EASYPAYMENTZ SECRET",
      type: "password",
    },
  },
  ISERVEU: {
    base_url_alt: {
      placeholder: "ISERVEU STATUS URL",
      type: "url",
    },
    client_id: {
      placeholder: "ISERVEU CLIENT ID",
      type: "password",
    },
    secret_ket: {
      placeholder: "ISERVEU CLIENT SECRET",
      type: "password",
    },
  },
  PAYCOONS: {
    client_id: {
      placeholder: "PAYCOONS CLIENT ID",
      type: "password",
    },
    secret_key: {
      placeholder: "PAYCOONS CLIENT SECRET KEY",
      type: "password",
    },
    merchant_id: {
      placeholder: "PAYCOONS MERCHANT ID",
      type: "password",
    },
  },
  ZAPAY: {
    merchant_id: {
      placeholder: "ZAPAY MERCHANT USER ID",
      type: "password",
    },
    secret_key: {
      placeholder: "ZAPAY PAYOUT API KEY",
      type: "password",
    },
  },
  ISMARTPAY: {
    merchant_id: {
      placeholder: "ISMARTPAY MERCHANT ID",
      type: "password",
    },
    secret_key: {
      placeholder: "ISMARTPAY API KEY",
      type: "password",
    },
    client_id: {
      placeholder: "ISMARTPAY WALLET ID",
      type: "password",
    },
  },
  PAYANYTIME: {
    merchant_id: {
      placeholder: "PayAnyTime Email ID",
      type: "password",
    },
    secret_key: {
      placeholder: "PayAnyTime Password",
      type: "password",
    },
  },
  FINIXPAY: {
    client_id: {
      placeholder: "FINIXPAY CLIENT ID",
      type: "password",
    },
    secret_key: {
      placeholder: "FINIXPAY CLIENT SECRET KEY",
      type: "password",
    },
    merchant_id: {
      placeholder: "FINIXPAY MERCHANT ID",
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
