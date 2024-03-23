import React from "react";
import { Tabs } from "antd";
import lo from "lodash";
import Title from "../../../components/Title";
import TransactionsTable from "./TransactionsTable";

const StatusTabs = ["pending", "success", "failed"];

const Deposit = () => (
  <div>
    <Title title="Deposit list" />
    <Tabs
      centered
      destroyInactiveTabPane
      items={new Array(StatusTabs.length).fill(null).map((_, i) => {
        const status = StatusTabs[i];
        return {
          label: lo.startCase(status),
          key: status,
          children: <TransactionsTable status={status} tableName="deposit" />,
        };
      })}
    />
  </div>
);

export default Deposit;
