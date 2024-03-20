import React from "react";
import { Tabs } from "antd";
import Title from "../../../components/Title";
import ModulesTable from "./ModulesTable";

const ViewModules = () => {
  const statusTabs = (panel_type) => [
    {
      key: "enable",
      label: "Active",
      children: <ModulesTable status="enable" panel_type={panel_type} />,
    },
    {
      key: "disable",
      label: "Inactive",
      children: <ModulesTable status="disable" panel_type={panel_type} />,
    },
  ];

  const types = [
    {
      key: "withdraw",
      label: "Withdraw",
      children: <Tabs items={statusTabs("withdraw")} destroyInactiveTabPane />,
    },
    {
      key: "deposit",
      label: "Deposit",
      children: <Tabs items={statusTabs("deposit")} destroyInactiveTabPane />,
    },
  ];

  return (
    <div>
      <Title title="View Panel" />
      <Tabs type="card" items={types} destroyInactiveTabPane centered />
    </div>
  );
};

export default ViewModules;
