import React, { useEffect, useState } from "react";
import lo from "lodash";
import propTypes from "prop-types";
import { message, Tag } from "antd";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import Loader from "../../../components/Loader";
import { objectToQueryString } from "../../../helpers/url";
import DataTable from "../../../components/DataTable";
import { formatTimestamp } from "../../../helpers/functions";
import DetailedTransactionModal from "../DetailedTransaction/DetailedTransactionModal";

const TransactionTypeColor = {
  withdraw: "red",
  deposit: "green",
};

const StatusColor = {
  pending: "yellow",
  processing: "orange",
  success: "green",
  failed: "red",
  acknowledged: "blue",
};

const getStatusbyType = (type, status, pg_task) => {
  if (type === "withdraw" && status === "pending" && pg_task) return "processing";
  return status;
};

const UserTransactions = ({ customer_id }) => {
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    scroll: {
      y: 800,
    },
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      ...tableParams,
      pagination,
      filters,
      ...sorter,
    });
  };

  const gettransactions = async ({ orderBy, dir, limit, skip } = {}) => {
    try {
      const { pageSize, current } = tableParams.pagination;

      const data = {
        orderBy,
        dir,
        skip: skip || current * pageSize - pageSize,
        limit: limit || pageSize,
      };
      let queryString = objectToQueryString(data);
      if (queryString) queryString = `?${queryString}`;

      const endpoint = apiConstants.GET_USER_TRANSACTIONS;
      const url = `${apiConstants.BASE_URL + endpoint.url(customer_id)}?${queryString}`;

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

  const initialiseTransactions = async () => {
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
      key: "type",
      render: (value) => <Tag color={TransactionTypeColor[value]}>{lo.startCase(value)}</Tag>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value, row) => {
        const { transaction_type, pg_task } = row;
        const status = getStatusbyType(transaction_type, value, pg_task);
        return <Tag color={StatusColor[status]}>{lo.startCase(status)}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (value) => formatTimestamp(value),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (value) => formatTimestamp(value),
    },
    {
      title: "Detailed View",
      dataIndex: "detailed_view",
      key: "transaction_id",
      render: (_, row) => (
        <DetailedTransactionModal
          customer_id={customer_id}
          transaction_id={row.transaction_id}
          transaction_type={row.transaction_type}
        />
      ),
    },
  ];

  useEffect(() => {
    initialiseTransactions();
  }, [tableParams.pagination]);

  if (isLoading) return <Loader message="Loading Transactions..." />;

  return (
    <div>
      <DataTable
        bordered
        tableName="Customer Transactions"
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
UserTransactions.propTypes = {
  customer_id: propTypes.string.isRequired,
};

export default UserTransactions;
