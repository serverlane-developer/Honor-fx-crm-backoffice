import React, { useState, useEffect } from "react";
import propTypes from "prop-types";
import { Button, Col, Modal } from "antd";
import Endpoints from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import Loader from "../../../components/Loader";
import DataTable from "../../../components/DataTable";
import { formatTimestamp, splitAndCapitalise } from "../../../helpers/functions";
import TransactionAction from "./TransactionActions";

const PaymentHistoryButton = ({ transactionId, panel_id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const onClose = () => setIsVisible(false);
  const onOpen = () => setIsVisible(true);

  return (
    <Col>
      <Button onClick={onOpen} size="large" type="default">
        View Payment History
      </Button>
      {isVisible && (
        <Modal
          title={
            <div>
              Transaction Id: <span style={{ fontWeight: "bold", paddingLeft: 4 }}>{transactionId}</span>
            </div>
          }
          open={isVisible}
          onCancel={onClose}
          footer={null}
          centered
          width="90%"
        >
          <PgOrderIdHistory transactionId={transactionId} panel_id={panel_id} />
        </Modal>
      )}
    </Col>
  );
};
PaymentHistoryButton.propTypes = {
  transactionId: propTypes.string.isRequired,
  panel_id: propTypes.string.isRequired,
};

const PgOrderIdHistory = ({ transactionId, panel_id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const getPgOrderIdHistory = async () => {
    try {
      setIsLoading(true);
      const url = `${Endpoints.BASE_URL + Endpoints.GET_PAYMENT_HISTORY.url(panel_id)}/${transactionId}`;
      let res = await callApi("get", url);
      res = res.data;
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const columnsObj = [
    "pg_order_id",
    "api_error",
    "pg_label",
    "payment_status",
    "payment_fail_count",
    "payment_req_method",
    "utr_id",
    "payment_order_id",
    "latest_status",
    "latest_message",
  ];

  let columns = columnsObj.map((column) => ({
    dataIndex: column,
    key: column,
    title: splitAndCapitalise(column),
  }));

  const createdAt = {
    dataIndex: "created_at",
    key: "created_at",
    title: "Created At",
    render: (cell, row) => formatTimestamp(row.created_at),
  };

  const updatedAt = {
    dataIndex: "updated_at",
    key: "updated_at",
    title: "Updated At",
    render: (cell, row) => formatTimestamp(row.updated_at),
  };

  const paymentCreationDate = {
    dataIndex: "payment_creation_date",
    key: "payment_creation_date",
    title: "Payment Creation Date",
    render: (cell, row) => row.payment_creation_date && formatTimestamp(row.payment_creation_date),
  };

  const refreshStatusColumn = {
    title: "Refresh Status",
    dataIndex: "pg_order_id",
    key: "status_refresh",
    render: (value) => (
      <TransactionAction action="refresh_pg_status" id={value} panel_id={panel_id} onSuccess={getPgOrderIdHistory} />
    ),
  };

  columns = [...columns, paymentCreationDate, createdAt, updatedAt, refreshStatusColumn];

  useEffect(() => {
    getPgOrderIdHistory();
  }, [transactionId]);

  if (isLoading) return <Loader message="Loading Payment History" />;

  return (
    <div style={{ overflowY: "auto" }}>
      <DataTable
        bordered
        columns={columns}
        dataSource={history}
        loading={isLoading}
        rowKey="pg_order_id"
        showHeader
        style={{ width: "100%" }}
        width="100%"
      />
    </div>
  );
};
PgOrderIdHistory.propTypes = {
  transactionId: propTypes.string.isRequired,
  panel_id: propTypes.string.isRequired,
};

export default PaymentHistoryButton;
