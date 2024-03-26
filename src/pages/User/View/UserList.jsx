import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Link } from "react-router-dom";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import Loader from "../../../components/Loader";
import DataTable from "../../../components/DataTable";
import { objectToQueryString } from "../../../helpers/url";
import LabelValue from "../../../components/LabelValue";
import { formatTimestamp } from "../../../helpers/functions";

const CustomerList = () => {
  const [customers, setCustomer] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    scroll: {
      y: 800,
    },
  });

  useEffect(() => {
    const getCustomers = async ({ orderBy, dir, limit, skip } = {}) => {
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

        const endpoint = apiConstants.GET_USERS;
        const url = apiConstants.BASE_URL + endpoint.url + queryString;

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
        const res = await getCustomers({});
        const customersList = res?.data?.data || [];
        setCustomer(customersList);
        const count = Number(res.headers["x-total-count"] || 0);
        setTotal(count);
      } catch (error) {
        message.error(getAxiosError(error) || "Error while fetching customers");
        console.error("Error while fetching customers", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialise();
  }, [tableParams.pagination]);

  const columns = [
    {
      title: "Sr No",
      dataIndex: "customer_id",
      key: "customer_id",
      render: (__, ___, i) => tableParams.pagination.pageSize * (tableParams.pagination.current - 1) + i + 1,
    },
    {
      key: "Details",
      label: "Details",
      render: (_, row) => (
        <div>
          <LabelValue label="Phone Number: " value={row?.phone_number} />
          <LabelValue label="username: " value={row?.username} />
          <LabelValue label="Email: " value={row?.email} />
        </div>
      ),
    },
    {
      title: "Deposit",
      dataIndex: "deposit",
      key: "deposit",
      render: (_, row) => (
        <div>
          <LabelValue label="Accounts: " value={row?.deposit_account_count} />
          <LabelValue label="Total Transactions: " value={row?.total_deposit_transactions} />
          <LabelValue label="Total Amount: " value={row?.total_deposit_amount} />
        </div>
      ),
    },
    {
      title: "Withdraw",
      dataIndex: "withdraw",
      key: "withdraw",
      render: (_, row) => (
        <div>
          <LabelValue label="Accounts: " value={row?.withdraw_account_count} />
          <LabelValue label="Total Transactions: " value={row?.total_withdraw_transactions} />
          <LabelValue label="Total Amount: " value={row?.total_withdraw_amount} />
        </div>
      ),
    },
    {
      title: "Timestamps",
      dataIndex: "created_at",
      key: "created_at",
      render: (____, row) => (
        <div>
          {/* <LabelValue label="Created By:" value={row.created_by} /> */}
          {row.created_at && <LabelValue label="Created At:" value={formatTimestamp(row.created_at)} />}
          {/* <LabelValue label="Updated By:" value={row.updated_by} /> */}
          {row.updated_at && <LabelValue label="Updated At:" value={formatTimestamp(row.updated_at)} />}
        </div>
      ),
    },
    {
      title: "View Profile",
      dataIndex: "update_module",
      key: "update_module",
      render: (value, row) => <Link to={`/users/profile/${row.customer_id}`}>View Profile</Link>,
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      ...tableParams,
      pagination,
      filters,
      ...sorter,
    });
  };

  if (isLoading) return <Loader message="Loading Customers..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <DataTable
        bordered
        columns={columns}
        dataSource={customers}
        onChange={handleTableChange}
        loading={isLoading}
        rowKey="customer_id"
        showHeader
        {...tableParams}
        pagination={{ ...tableParams.pagination, total }}
        style={{ width: "100%" }}
        width="100%"
      />
    </div>
  );
};

CustomerList.propTypes = {};

export default CustomerList;
