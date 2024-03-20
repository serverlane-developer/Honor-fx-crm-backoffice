import React, { useEffect, useState } from "react";
import moment from "moment";

import { message } from "antd";
import { Link } from "react-router-dom";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";

import getAxiosError from "../../../helpers/getAxiosError";

import Loader from "../../../components/Loader";
import DataTable from "../../../components/DataTable";
import appConstants from "../../../config/appConstants";
import { objectToQueryString } from "../../../helpers/url";
import SubmodulesTable from "./SubmodulesTable";

import { getModuleName } from "../../../helpers/functions";
import ConfirmSwitch from "../../../components/ConfirmSwitch";

const ModulesTable = () => {
  const [modules, setModules] = useState([]);
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
    const getModules = async ({ orderBy, dir, limit, skip } = {}) => {
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

        const endpoint = apiConstants.GET_MODULES;
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
        const res = await getModules();
        setModules(res?.data?.data?.modules || []);
        const count = Number(res.headers["x-total-count"] || 0);
        setTotal(count);
      } catch (error) {
        message.error(getAxiosError(error) || "Error while fetching modules");
        console.error("Error while fetching modules", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialise();
  }, [tableParams.pagination]);

  const onStatusToggle = async (id, isDeleted) => {
    const endpoint = apiConstants.DELETE_MODULE;
    const url = `${apiConstants.BASE_URL}${endpoint.url}/${id}`;
    const { data } = await callApi(endpoint.method, url, { is_deleted: isDeleted });
    return data;
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "user_id",
      key: "user_id",
      render: (__, ___, i) => tableParams.pagination.pageSize * (tableParams.pagination.current - 1) + i + 1,
    },
    {
      title: "Module Name",
      dataIndex: "module_name",
      key: "module_name",
      render: (value) => getModuleName(value),
    },
    {
      title: "Submodule Count",
      dataIndex: "submodule_count",
      key: "submodule_count",
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
      title: "Update Module",
      dataIndex: "update_module",
      key: "update_module",
      render: (value, row) => (
        <Link to={`/modules/update/module/${row.module_id}`}>Update {getModuleName(row.module_name)}</Link>
      ),
    },
    {
      title: "Toggle Status",
      dataIndex: "is_deleted",
      key: "is_deleted",
      render: (value, row) => (
        <ConfirmSwitch
          module="module"
          initialState={value}
          onToggle={onStatusToggle}
          id={row.module_id}
          successMessage="Successfully switched module status"
          key={`${row.module_id}_status_switch`}
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

  if (isLoading) return <Loader message="Loading Modules..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <DataTable
        bordered
        columns={columns}
        dataSource={modules}
        onChange={handleTableChange}
        loading={isLoading}
        rowKey="module_id"
        showHeader
        {...tableParams}
        pagination={{ ...tableParams.pagination, total }}
        style={{ width: "100%" }}
        width="100%"
        expandable={{
          // eslint-disable-next-line react/no-unstable-nested-components
          expandedRowRender: (row) => <SubmodulesTable moduleId={row?.module_id} />,
          rowExpandable: (row) => Number(row?.submodule_count) > 0 && !!row.module_id,
        }}
      />
    </div>
  );
};

export default ModulesTable;
