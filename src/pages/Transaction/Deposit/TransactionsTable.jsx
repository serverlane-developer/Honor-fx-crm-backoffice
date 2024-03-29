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
import ViewHistory from "../../../components/HistoryTable";
// import CopyDetails from "../Withdraw/CopyDetails";
// import TransactionAction from "./TransactionActions";
// import TransactionAction from "./TransactionActions";

// const statusActions = {
//   pending: "",
//   processing: "",
//   success: "retry_rpa",
//   failed: "retry_rpa",
// };

const TransactionsTable = ({ status }) => {
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

      const endpoint = apiConstants.GET_DEPOSIT_TRANSACTIONS_BY_STATUS;
      const url = `${apiConstants.BASE_URL + endpoint.url}/${status}${queryString}`;

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
      title: "Type",
      dataIndex: "transaction_type",
      key: "transaction_type",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Customer",
      dataIndex: "created_by",
      key: "created_by",
      render: (___, row) => (
        <div>
          <LabelValue label="Username:" value={row.created_by} />
          <LabelValue label="Phone:" value={row.phone_number} />
        </div>
      ),
    },
  ];

  const mt5Col = {
    title: "MT5",
    dataIndex: "mt5",
    key: "mt5",
    render: (___, row) => (
      <div>
        <LabelValue label="Deal ID" value={row.dealid} />
        <LabelValue label="Margin" value={row.margin} />
        <LabelValue label="Freemargin" value={row.freemargin} />
        <LabelValue label="Equity" value={row.equity} />
      </div>
    ),
  };
  if (["success", "processing"].includes(status)) columns.push(mt5Col);

  const statusCol = {
    title: "Status",
    dataIndex: "status",
    key: "mt5",
    render: (___, row) => (
      <div>
        <LabelValue label="Status" value={row.status} />
        <LabelValue label="MT5 Status" value={row.mt5_status} />
        <LabelValue label="Payout Status" value={row.payout_status} />
      </div>
    ),
  };
  // if (["success", "processing"].includes(status))
  columns.push(statusCol);

  const messageCol = {
    title: "Message",
    dataIndex: "message",
    key: "mt5",
    render: (___, row) => (
      <div>
        <LabelValue label="Message" value={row.message} />
        <LabelValue label="MT5 Message" value={row.mt5_message} />
        <LabelValue label="Payout Message" value={row.payout_message} />
        <LabelValue label="Admin Message" value={row.admin_message} />
      </div>
    ),
  };
  if (["success", "processing", "failed"].includes(status)) columns.push(messageCol);

  const utrCol = {
    title: "UTR",
    dataIndex: "utr_id",
    key: "utr_id",
  };
  if (["success", "processing"].includes(status)) columns.push(utrCol);

  const timestampsCol = {
    title: "Timestamps",
    dataIndex: "created_at",
    key: "created_at",
    render: (____, row) => (
      <div>
        {/* <LabelValue label="Created By:" value={row.created_by} /> */}
        {row.created_at && (
          <LabelValue label="Created At:" value={moment(row.created_at).format(appConstants.dateFormat)} />
        )}
        {/* <LabelValue label="Updated By:" value={row.updated_by} /> */}
        {row.updated_at && (
          <LabelValue label="Updated At:" value={moment(row.updated_at).format(appConstants.dateFormat)} />
        )}

        {row.verified_at && (
          <LabelValue label="Verified at" value={moment(row.verified_at).format(appConstants.dateFormat)} />
        )}
        <LabelValue label="Verified By" value={row.verified_by} />
      </div>
    ),
  };
  columns.push(timestampsCol);

  const historyCol = {
    dataIndex: "history",
    key: "history",
    title: "View History",
    render: (_, row) => (
      <div style={{ textAlign: "center" }}>
        <div style={{ paddingBottom: 6 }}>
          <ViewHistory id={row.transaction_id} type="deposit" />
        </div>
      </div>
    ),
  };
  if (status !== "pending") columns.push(historyCol);

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
      <Row justify="space-between" align="middle" style={{ padding: "12px 0" }}>
        <Col span={12} style={{ fontWeight: 600, fontSize: 16 }}>
          [{total}] {lo.capitalize(status)} Transactions
          <Tooltip title="Refresh List">
            <Button icon={<SyncOutlined />} onClick={initialise} style={{ marginLeft: 12 }} type="primary" />
          </Tooltip>
        </Col>
        <Col span={6} style={{ textAlign: "right" }}>
          {["success", "acknowledged"].includes(status) && (
            <Input.Search
              loading={isLoading}
              placeholder="Search Account Number/name, UTR Number"
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
  status: propTypes.oneOf(["pending", "processing", "success", "failed", "refund"]).isRequired,
};

export default TransactionsTable;
