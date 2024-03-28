import React, { useEffect, useState } from "react";
import moment from "moment";

import { message } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";

import getAxiosError from "../../../helpers/getAxiosError";

import Loader from "../../../components/Loader";
import DataTable from "../../../components/DataTable";
import appConstants from "../../../config/appConstants";
import { objectToQueryString } from "../../../helpers/url";
import ConfirmSwitch from "../../../components/ConfirmSwitch";
import UserReferralCode from "../../Referral/UserReferralCode";

const AdminTable = () => {
  const user = useSelector((state) => state.login.data);
  const hasReferral = (user?.modules || []).includes("referral");
  const [users, setUsers] = useState([]);
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
    const getAdminUsers = async ({ orderBy, dir, limit, skip } = {}) => {
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

        const endpoint = apiConstants.GET_ADMINS;
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
        const res = await getAdminUsers();
        setUsers(res?.data?.data?.users || []);
        const count = Number(res.headers["x-total-count"] || 0);
        setTotal(count);
      } catch (error) {
        message.error(getAxiosError(error) || "Error while fetching roles");
        console.error("Error while fetching roles", error);
      } finally {
        setIsLoading(false);
      }
    };
    initialise();
  }, [tableParams.pagination]);

  const onStatusToggle = async (id, isDeleted) => {
    const endpoint = apiConstants.DELETE_ADMIN;
    const url = `${apiConstants.BASE_URL}${endpoint.url}/${id}`;
    const { data } = await callApi(endpoint.method, url, { is_deleted: isDeleted });
    return data;
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "role_id",
      key: "user_id",
      render: (__, ___, i) => tableParams.pagination.pageSize * (tableParams.pagination.current - 1) + i + 1,
    },
    {
      title: "Email ID",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "2FA Enabled",
      dataIndex: "enable_two_factor_auth",
      key: "enable_two_factor_auth",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Last Login",
      dataIndex: "last_login",
      key: "last_login",
      render: (_, row) => (
        <div>
          {row.last_login_timestamp && (
            <div>
              <span style={{ fontWeight: "lighter" }}>Timestamp: </span>
              <span style={{ fontWeight: "bold" }}>
                {moment(row.last_login_timestamp).format(appConstants.dateFormat)}
              </span>
            </div>
          )}
          {row.last_login_ip && (
            <div>
              <span style={{ fontWeight: "lighter" }}>IP: </span>
              <span style={{ fontWeight: "bold" }}>{row.last_login_ip}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role_name",
      key: "role_name",
    },
    ...(hasReferral && [
      {
        title: "Referral Code",
        dataIndex: "user_id",
        key: "user_id",
        render: (value) => <UserReferralCode user_id={value} size="small" />
      },
    ]),
    {
      title: "Created by",
      dataIndex: "created_by",
      key: "created_by",
      render: (value) => value || "Seed",
    },
    {
      title: "Updated by",
      dataIndex: "updated_by",
      key: "updated_by",
      render: (value) => value || "Seed",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (value) => moment(value).format(appConstants.dateFormat),
    },
    {
      title: "Update User",
      dataIndex: "update_user",
      key: "update_user",
      render: (value, row) => <Link to={`/admin/update/${row.user_id}`}>Update {row.username}</Link>,
    },
    {
      title: "Toggle Status",
      dataIndex: "is_deleted",
      key: "is_deleted",
      render: (value, row) => (
        <ConfirmSwitch
          module="user"
          initialState={value}
          onToggle={onStatusToggle}
          id={row.user_id}
          successMessage="Successfully switched user status"
          key={`${row.user_id}_status_switch`}
        />
      ),
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

  if (isLoading) return <Loader message="Loading Users..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <DataTable
        bordered
        columns={columns}
        dataSource={users}
        onChange={handleTableChange}
        loading={isLoading}
        rowKey="user_id"
        showHeader
        {...tableParams}
        pagination={{ ...tableParams.pagination, total }}
        style={{ width: "100%" }}
        width="100%"
      />
    </div>
  );
};

export default AdminTable;
