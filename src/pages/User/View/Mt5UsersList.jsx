import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import { message } from "antd";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import Loader from "../../../components/Loader";
import { objectToQueryString } from "../../../helpers/url";
import DataTable from "../../../components/DataTable";
import { formatTimestamp } from "../../../helpers/functions";
import LabelValue from "../../../components/LabelValue";

const Mt5UsersList = ({ customer_id }) => {
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);
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

  const getlist = async ({ orderBy, dir, limit, skip } = {}) => {
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

      const endpoint = apiConstants.GET_USER_MT5_USER_LIST;
      const url = `${apiConstants.BASE_URL + endpoint.url(customer_id)}${queryString}`;

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
      const res = await getlist();
      setList(res?.data?.data?.users || []);
      const count = Number(res.headers["x-total-count"] || 0);
      setTotal(count);
    } catch (error) {
      message.error(getAxiosError(error) || "Error while fetching list");
      console.error("Error while fetching list", error);
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
      title: "MT5 ID",
      dataIndex: "mt5_id",
      key: "mt5_id",
    },
    {
      title: "Profile",
      dataIndex: "profile",
      key: "profile",
      render: (____, row) => (
        <div>
          <LabelValue label="Client Name:" value={row.client_name} />
          <LabelValue label="Email:" value={row.email} />
          <LabelValue label="Phone Number:" value={row.phone_number} />
        </div>
      ),
    },
    {
      title: "Passwords",
      dataIndex: "passwords",
      key: "passwords",
      render: (____, row) => (
        <div>
          <LabelValue label="Master Password:" value={row.master_password} />
          <LabelValue label="Investor Password:" value={row.investor_password} />
        </div>
      ),
    },
    {
      title: "MT5 Details",
      dataIndex: "mt5_related",
      key: "mt5_related",
      render: (____, row) => (
        <div>
          <LabelValue label="Leverage:" value={row.leverage} />
          <LabelValue label="MT Group:" value={row.mt_group} />
          <LabelValue label="Country:" value={row.country} />
          <LabelValue label="MT5 IP:" value={row.mt5_ip} />
        </div>
      ),
    },
    {
      title: "Timestamps",
      dataIndex: "created_at",
      key: "created_at",
      render: (____, row) => (
        <div>
          {row.created_at && <LabelValue label="Created At:" value={formatTimestamp(row.created_at)} />}
          {row.updated_at && <LabelValue label="Updated At:" value={formatTimestamp(row.updated_at)} />}
        </div>
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
        dataSource={list}
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
Mt5UsersList.propTypes = {
  customer_id: propTypes.string.isRequired,
};

export default Mt5UsersList;
