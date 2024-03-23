/* eslint-disable react/forbid-prop-types */
import React, { useState } from "react";
import propTypes from "prop-types";
import { Button, Col, Modal, Row, Table, message } from "antd";
import { PaymentDetails, TransactionDetails } from "./tableHelper";
import Endpoints from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";

const RefreshMultiple = ({ transactions, onSuccess }) => {
  const [isVisible, setIsVisible] = useState(false);
  const onClose = () => setIsVisible(false);
  const onOpen = () => setIsVisible(true);

  const label = "Refresh Multiple Transactions";

  if (!transactions?.length) return null;

  return (
    <Col>
      <Button onClick={onOpen} size="large" type="default">
        {label}
      </Button>
      {isVisible && (
        <Modal title={label} open={isVisible} onCancel={onClose} footer={null} centered width="90%">
          <RefreshList transactions={transactions} onSuccess={onSuccess} />
        </Modal>
      )}
    </Col>
  );
};
RefreshMultiple.propTypes = {
  transactions: propTypes.array.isRequired,
  onSuccess: propTypes.func.isRequired,
};

const RefreshList = ({ transactions, onSuccess }) => {
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_, __, i) => <div>{i + 1}</div>,
    },
    {
      title: "Transaction Details",
      dataIndex: "",
      key: "transaction_name",
      render: (___, row) => <TransactionDetails transaction={row} />,
    },
    {
      title: "Payment Details",
      dataIndex: "payment",
      key: "transaction_name",
      render: (___, row) => <PaymentDetails transaction={row} viewReceipt={false} />,
    },
  ];

  const onSelectAll = () => setSelected([...transactions.map((x) => x?.pg_order_id)]);
  const onUnselectAll = () => setSelected([]);
  const onSelectFirstTen = () => setSelected([...transactions.slice(0, 10).map((x) => x?.pg_order_id)]);

  const onRefresh = async () => {
    try {
      setIsLoading(true);
      const endpoint = Endpoints.REFRESH_MULTIPLE_PAYMENT_STATUS;
      const url = `${Endpoints.BASE_URL}/${endpoint.url}`;
      const { data } = await callApi(endpoint.method, url, { pg_order_ids: selected });

      message.success(data?.message);
      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = `Error while Refreshing Multiple Transactions`;
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ padding: "12px 0" }}>
        <Col span={8} style={{ fontWeight: 600, fontSize: 16 }}>
          Select Transactions to Refresh their Status
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Button style={{ margin: "0px 4px" }} onClick={onSelectAll} disabled={isLoading}>
            Select All
          </Button>
          <Button style={{ margin: "0px 4px" }} onClick={onSelectFirstTen} disabled={isLoading}>
            Select 10
          </Button>
          <Button style={{ margin: "0px 4px" }} onClick={onUnselectAll} disabled={isLoading}>
            Unselect All
          </Button>
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={onRefresh} loading={isLoading}>
            Refresh
          </Button>
        </Col>
      </Row>
      <Table
        size="small"
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: selected,
          onChange: setSelected,
          getCheckboxProps: () => ({
            disabled: isLoading,
          }),
        }}
        columns={columns}
        dataSource={transactions}
        rowKey="pg_order_id"
      />
    </div>
  );
};
RefreshList.propTypes = {
  transactions: propTypes.array.isRequired,
  onSuccess: propTypes.func.isRequired,
};

export default RefreshMultiple;
