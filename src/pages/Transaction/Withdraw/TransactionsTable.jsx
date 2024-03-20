import React, { useEffect, useState } from "react";
import moment from "moment";
import propTypes from "prop-types";
import lo from "lodash";

import { Button, Col, Input, Row, Tooltip, message } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";

import getAxiosError from "../../../helpers/getAxiosError";

import Loader from "../../../components/Loader";
import DataTable from "../../../components/DataTable";
import LabelValue from "../../../components/LabelValue";
import appConstants from "../../../config/appConstants";
import { objectToQueryString } from "../../../helpers/url";
import UpdateTransactionStatus from "./UpdateTransactionStatus";
import TransactionAction from "./TransactionActions";
import ViewHistory from "../../../components/HistoryTable";
import PaymentHistoryButton from "./PaymentHistory";
import { PaymentDetails, TransactionDetails } from "./tableHelper";
import RefreshMultiple from "./RefreshMultiple";
import ViewBalance from "../../PaymentGateway/View/ViewBalance";

const statusActions = {
  pending: "retry_payout",
  processing: "refresh_status",
  success: "retry_rpa",
  failed: "retry_rpa",
};

const TransactionsTable = ({ status, panel_id, pg_id }) => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 50,
    },
    scroll: {
      y: 800,
    },
  });

  const gettransactions = async ({ orderBy, dir, limit, skip } = {}) => {
    try {
      const { pageSize, current } = tableParams.pagination;

      const data = {
        orderBy,
        dir,
        skip: skip || current * pageSize - pageSize,
        limit: limit || pageSize,
        search,
      };
      let queryString = objectToQueryString(data);
      if (queryString) queryString = `?${queryString}`;

      const endpoint = apiConstants.GET_WITHDRAW_TRANSACTIONS_BY_STATUS;
      const url = `${apiConstants.BASE_URL + endpoint.url(panel_id)}/${status}${queryString}`;

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

  const initialise = async () => {
    try {
      setIsLoading(true);
      const res = await gettransactions();
      setTransactions(res?.data?.data?.transactions || []);
      const count = Number(res.headers["x-total-count"] || 0);
      setTotal(count);
    } catch (error) {
      message.error(getAxiosError(error) || "Error while fetching transactions");
      console.error("Error while fetching transactions", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSearchChange = (e) => setSearch(e?.target?.value);

  useEffect(() => {
    initialise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, tableParams.pagination]);

  const columns = [
    {
      title: "Sr No",
      dataIndex: "i",
      key: "transaction_id",
      render: (__, ___, i) => tableParams.pagination.pageSize * (tableParams.pagination.current - 1) + i + 1,
    },
    {
      title: "Transaction Details",
      dataIndex: "",
      key: "transaction_name",
      render: (___, row) => <TransactionDetails canCopy transaction={row} />,
    },
    {
      title: "Payment Details",
      dataIndex: "payment",
      key: "transaction_name",
      render: (___, row) => <PaymentDetails transaction={row} panel_id={panel_id} />,
    },
  ];

  const rpaCol = {
    title: "RPA",
    dataIndex: "rpa",
    key: "rpa",
    render: (___, row) => (
      <div>
        <LabelValue label="RPA Status" value={row.rpa_status} />
        <LabelValue label="RPA Message" value={row.rpa_message} />
      </div>
    ),
  };
  if (["success"].includes(status)) columns.push(rpaCol);

  const timestampsCol = {
    title: "Timestamps",
    dataIndex: "created_at",
    key: "created_at",
    render: (____, row) => (
      <div>
        <LabelValue label="Created By:" value={row.created_by} />
        {row.created_at && (
          <LabelValue label="Created At:" value={moment(row.created_at).format(appConstants.dateFormat)} />
        )}
        <LabelValue label="Updated By:" value={row.updated_by} />
        {row.updated_at && (
          <LabelValue label="Updated At:" value={moment(row.updated_at).format(appConstants.dateFormat)} />
        )}
      </div>
    ),
  };
  columns.push(timestampsCol);

  const statusUpdateCol = {
    title: "Update Status",
    dataIndex: "transaction_id",
    key: "transaction_id_status_update",
    render: (value) =>
      value && <UpdateTransactionStatus transactionId={value} panel_id={panel_id} isModal onSuccess={initialise} />,
  };
  if (status === "pending") columns.push(statusUpdateCol);

  const actionsCol = {
    title: "Actions",
    dataIndex: "transaction_id",
    key: "transaction_actions",
    render: (value, row) => {
      const action = statusActions[status];
      const id = status === "processing" ? row.pg_order_id : value;

      const canRetryRpa = ["pending", "processing"].includes(status) ? true : [null, "failed"].includes(row.rpa_status);

      const hideAction = !action || !id || !canRetryRpa;

      return (
        <div>
          {!hideAction && <TransactionAction action={action} id={id} onSuccess={initialise} panel_id={panel_id} />}
          <div style={{ margin: "12px 0" }}>
            {status === "success" && (
              <TransactionAction action="acknowledge" id={id} onSuccess={initialise} panel_id={panel_id} />
            )}
          </div>
        </div>
      );
    },
  };
  columns.push(actionsCol);

  const historyCol = {
    dataIndex: "history",
    key: "history",
    title: "View History",
    render: (_, row) => (
      <div style={{ textAlign: "center" }}>
        <div style={{ paddingBottom: 6 }}>
          <ViewHistory id={row.transaction_id} type="withdraw" panel_id={panel_id} />
        </div>
        <div style={{ paddingTop: 6 }}>
          <PaymentHistoryButton transactionId={row.transaction_id} panel_id={panel_id} />
        </div>
      </div>
    ),
  };
  columns.push(historyCol);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      ...tableParams,
      pagination,
      filters,
      ...sorter,
    });
  };

  if (isLoading) {
    return <Loader message="Loading Transactions..." padding={50} size={24} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Row align="end" justify="center" style={{ paddingRight: 10 }}>
        <span style={{ marginTop: 5, marginRight: 5 }}>View Balance</span>
        <ViewBalance pgId={pg_id} />
      </Row>
      <Row justify="space-between" align="middle" style={{ padding: "12px 0" }}>
        <Col span={12} style={{ fontWeight: 600, fontSize: 16 }}>
          [{total}] {lo.capitalize(status)} Transactions
          <Tooltip title="Refresh List">
            <Button icon={<SyncOutlined />} onClick={initialise} style={{ marginLeft: 12 }} type="primary" />
          </Tooltip>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          {status === "processing" && (
            <RefreshMultiple transactions={transactions} panel_id={panel_id} onSuccess={initialise} />
          )}
          {["success", "acknowledged"].includes(status) && (
            <Input.Search
              loading={isLoading}
              placeholder="Search Account Number/name, PG Order ID, UTR ID"
              value={search}
              onChange={onSearchChange}
              onSearch={initialise}
              style={{
                width: "100%",
              }}
              size="large"
            />
          )}
        </Col>
      </Row>
      <DataTable
        bordered
        columns={columns}
        dataSource={transactions}
        onChange={handleTableChange}
        loading={isLoading}
        rowKey="transaction_id"
        showHeader
        {...tableParams}
        pagination={{ ...tableParams.pagination, total }}
        style={{ width: "100%" }}
        width="100%"
      />
    </div>
  );
};
TransactionsTable.propTypes = {
  status: propTypes.oneOf(["pending", "processing", "success", "failed", "refund", "acknowledged"]).isRequired,
  panel_id: propTypes.string.isRequired,
  pg_id: propTypes.string.isRequired,
};

export default TransactionsTable;
