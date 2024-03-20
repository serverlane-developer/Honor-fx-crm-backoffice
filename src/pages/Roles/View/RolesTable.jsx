import React, { useEffect, useState } from "react";
import moment from "moment";
import _ from "lodash";

import { message } from "antd";
import { Link } from "react-router-dom";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";

import getAxiosError from "../../../helpers/getAxiosError";

import Loader from "../../../components/Loader";
import DataTable from "../../../components/DataTable";
import appConstants from "../../../config/appConstants";
import { objectToQueryString } from "../../../helpers/url";
import ConfirmSwitch from "../../../components/ConfirmSwitch";

const RolesTable = () => {
  const [roles, setRoles] = useState([]);
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
    const getroles = async ({ orderBy, dir, limit, skip } = {}) => {
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

        const endpoint = apiConstants.GET_ROLES;
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
        const res = await getroles();
        setRoles(res?.data?.data?.roles || []);
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
    const endpoint = apiConstants.DELETE_ROLES;
    const url = `${apiConstants.BASE_URL}${endpoint.url}/${id}`;
    const { data } = await callApi(endpoint.method, url, { is_deleted: isDeleted });
    return data;
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "role_id",
      key: "role_id",
      render: (__, ___, i) => tableParams.pagination.pageSize * (tableParams.pagination.current - 1) + i + 1,
    },
    {
      title: "Role Name",
      dataIndex: "role_name",
      key: "role_name",
      render: (value) => _.startCase(value.split("-").join(" ")),
    },
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
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (value) => moment(value).format(appConstants.dateFormat),
    },
    {
      title: "Update Role",
      dataIndex: "update_role",
      key: "update_role",
      render: (value, row) => <Link to={`/roles/update/${row.role_id}`}>Update {row.role_name}</Link>,
    },
    {
      title: "Toggle Status",
      dataIndex: "is_deleted",
      key: "is_deleted",
      render: (value, row) => (
        <ConfirmSwitch
          module="role"
          initialState={value}
          onToggle={onStatusToggle}
          id={row.role_id}
          successMessage="Successfully switched role status"
          key={`${row.role_id}_status_switch`}
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

  if (isLoading) return <Loader message="Loading Roles..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <DataTable
        bordered
        columns={columns}
        dataSource={roles}
        onChange={handleTableChange}
        loading={isLoading}
        rowKey="role_id"
        showHeader
        {...tableParams}
        pagination={{ ...tableParams.pagination, total }}
        style={{ width: "100%" }}
        width="100%"
      />
    </div>
  );
};

export default RolesTable;
