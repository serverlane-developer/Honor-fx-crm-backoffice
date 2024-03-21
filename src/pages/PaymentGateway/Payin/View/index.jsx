import React from "react";
import { Tabs } from "antd";
import Title from "../../../../components/Title";
import PaymentGatewayTable from "./PaymentGatewayTable";

const ViewPaymentGateway = () => {
  const items = [
    {
      key: "enable",
      label: "Active",
      children: <PaymentGatewayTable status="enable" />,
    },
    {
      key: "disable",
      label: "Inactive",
      children: <PaymentGatewayTable status="disable" />,
    },
  ];

  return (
    <div>
      <Title title="View Payment Gateways" />
      <Tabs defaultActiveKey="1" items={items} destroyInactiveTabPane />
    </div>
  );
};

export default ViewPaymentGateway;
