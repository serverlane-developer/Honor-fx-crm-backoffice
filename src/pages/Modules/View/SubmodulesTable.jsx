import React, { useEffect, useState } from "react";
import moment from "moment";
import propTypes from "prop-types";

import { Alert, Col, Row } from "antd";
import { Link } from "react-router-dom";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";

import getAxiosError from "../../../helpers/getAxiosError";

import Loader from "../../../components/Loader";
import DataTable from "../../../components/DataTable";
import appConstants from "../../../config/appConstants";
import { objectToQueryString } from "../../../helpers/url";
import { getModuleName } from "../../../helpers/functions";
import ConfirmSwitch from "../../../components/ConfirmSwitch";

const SubmodulesTable = ({ moduleId }) => {
  const [submodules, setSubmodules] = useState([]);
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
  const [error, setError] = useState("");

  useEffect(() => {
    const getModules = async ({ orderBy, dir, limit, skip } = {}) => {
      try {
        const { pageSize, current } = tableParams.pagination;

        const data = {
          orderBy,
          dir,
          skip: skip || current * pageSize - pageSize,
          limit: limit || pageSize,
          module_id: moduleId,
        };
        let queryString = objectToQueryString(data);
        if (queryString) queryString = `?${queryString}`;

        const endpoint = apiConstants.GET_SUBMODULES_FOR_MODULE;
        const url = apiConstants.BASE_URL + endpoint.url + queryString;

        const response = await callApi(endpoint.method, url);

        if (response.error) {
          throw new Error(response.error);
        }
        return response;
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    const initialise = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await getModules();
        setSubmodules(res?.data?.data?.submodules || []);
        const count = Number(res.headers["x-total-count"] || 0);
        setTotal(count);
      } catch (err) {
        const errorMessage = getAxiosError(err) || "Error while fetching modules";
        console.error("Error while fetching modules", err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initialise();
  }, [tableParams.pagination, moduleId]);

  const onStatusToggle = async (id, isDeleted) => {
    const endpoint = apiConstants.DELETE_SUBMODULE;
    const url = `${apiConstants.BASE_URL}${endpoint.url}/${id}`;
    const { data } = await callApi(endpoint.method, url, { is_deleted: isDeleted });
    return data;
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "submodule_id",
      key: "submodule_id",
      render: (__, ___, i) => tableParams.pagination.pageSize * (tableParams.pagination.current - 1) + i + 1,
    },
    {
      title: "Submodule Name",
      dataIndex: "submodule_name",
      key: "submodule_name",
      render: (value) => getModuleName(value),
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
      title: "Update Submodule",
      dataIndex: "update_submodule",
      key: "update_submodule",
      render: (value, row) => (
        <Link to={`/modules/update/submodule/${row.submodule_id}`}>Update {getModuleName(row.submodule_name)}</Link>
      ),
    },
    {
      title: "Toggle Status",
      dataIndex: "is_deleted",
      key: "is_deleted",
      render: (value, row) => (
        <ConfirmSwitch
          module="submodule"
          initialState={value}
          onToggle={onStatusToggle}
          id={row.submodule_id}
          successMessage="Successfully switched submodule status"
          key={`${row.submodule_id}_status_switch`}
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

  if (isLoading) return <Loader message="Loading Submodules..." />;

  if (error) {
    return <Alert message={error} showIcon type="error" closable />;
  }

  return (
    <Row style={{ background: "#00000010", padding: 4 }}>
      <Col offset={2} span={20}>
        <DataTable
          bordered
          columns={columns}
          dataSource={submodules}
          onChange={handleTableChange}
          loading={isLoading}
          rowKey="submodule_id"
          showHeader
          {...tableParams}
          pagination={{ ...tableParams.pagination, total }}
          style={{ width: "100%" }}
          width="100%"
          tableName="Submodules"
        />
      </Col>
    </Row>
  );
};
SubmodulesTable.propTypes = {
  moduleId: propTypes.string.isRequired,
};
export default SubmodulesTable;
