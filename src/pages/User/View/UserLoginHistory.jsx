import React, { useEffect, useState } from "react";
import { Badge, Tag, message } from "antd";
import moment from "moment";
import _ from "lodash";

import { useParams } from "react-router-dom";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";

import getAxiosError from "../../../helpers/getAxiosError";

import Loader from "../../../components/Loader";
import DataTable from "../../../components/DataTable";
import appConstants from "../../../config/appConstants";
// import Description from "../../../components/Description";
import { objectToQueryString } from "../../../helpers/url";
import ErrorMessage from "../../../components/ErrorMessage";

const UserLoginHistory = () => {
  const { customer_id } = useParams();

  const [history, setHistory] = useState([]);
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

  const getLoginHistory = async ({ orderBy, dir, limit, skip, searchText } = {}) => {
    try {
      if (searchText) {
        skip = 0;
      }

      const { pageSize, current } = tableParams.pagination;

      const data = {
        orderBy,
        dir,
        skip: skip || current * pageSize - pageSize,
        limit: limit || pageSize,
        searchText,
      };
      let queryString = objectToQueryString(data);
      if (queryString) queryString = `?${queryString}`;

      const endpoint = apiConstants.GET_USER_LOGIN_HISTORY;
      const url = apiConstants.BASE_URL + endpoint.url(customer_id) + queryString;

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
      const res = await getLoginHistory();
      setHistory(res.data.data);
      const count = Number(res.headers["x-total-count"] || 0);
      setTotal(count);
    } catch (error) {
      message.error(getAxiosError(error) || "Error while fetching users");
      console.error("Error while fetching users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "user_id",
      key: "user_id",
      render: (__, ___, i) => tableParams.pagination.pageSize * (tableParams.pagination.current - 1) + i + 1,
    },
    {
      title: "Login Type",
      dataIndex: "attempt_type",
      key: "attempt_type",
      render: (value) => (
        <Badge
          count={_.startCase(value)}
          style={{
            backgroundColor: value === "otp" ? "#ef233c" : "#4361ee",
          }}
        />
      ),
    },
    {
      title: "Login At",
      dataIndex: "created_at",
      key: "created_at",
      render: (value) => moment(value).format(appConstants.dateFormat),
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Login Success",
      dataIndex: "is_attempt_success",
      key: "is_attempt_success",
      render: (value) => <Tag color={value ? "success" : "error"}>{value ? "Yes" : "No"}</Tag>,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
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

  const stringifiedTableParams = JSON.stringify(tableParams);

  useEffect(() => {
    initialise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedTableParams]);

  if (!customer_id) return <ErrorMessage message="Customer ID is required" />;

  if (isLoading) return <Loader message="Loading Login History..." />;

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <DataTable
          bordered
          columns={columns}
          dataSource={history}
          onChange={handleTableChange}
          loading={isLoading}
          rowKey="customer_login_log_id"
          showHeader
          {...tableParams}
          pagination={{ ...tableParams.pagination, total }}
          style={{ width: "100%" }}
          width="100%"
          // tableName="Login History"
          // expandable={{
          //   // eslint-disable-next-line react/no-unstable-nested-components
          //   expandedRowRender: (row) => <Description items={row?.device || null} title="Device Details" />,
          //   rowExpandable: (row) => !!row?.device,
          // }}
        />
      </div>
    </div>
  );
};

export default UserLoginHistory;
