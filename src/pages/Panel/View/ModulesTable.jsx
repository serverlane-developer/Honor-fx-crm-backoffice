import React, { useEffect, useState } from "react";
import moment from "moment";
import propTypes from "prop-types";
import { message } from "antd";
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
import LabelValue from "../../../components/LabelValue";
import AssignedUsers from "./AssignedUsers";
import ViewHistory from "../../../components/HistoryTable";
import PanelTransactionStats from "./PanelTransactionStats";

const ModulesTable = ({ status, panel_type }) => {
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
          status,
          type: panel_type,
        };
        let queryString = objectToQueryString(data);
        if (queryString) queryString = `?${queryString}`;

        const endpoint = apiConstants.GET_PANELS;
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
        const modulesList = res?.data?.data || [];
        setModules(modulesList);
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
    const endpoint = apiConstants.DELETE_PANEL;
    const url = `${apiConstants.BASE_URL}${endpoint.url}/${id}`;
    const { data } = await callApi(endpoint.method, url, {
      is_deleted: isDeleted,
    });
    return data;
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "panel_id",
      key: "panel_id",
      render: (__, ___, i) => tableParams.pagination.pageSize * (tableParams.pagination.current - 1) + i + 1,
    },
    {
      title: "Panel Name",
      dataIndex: "panel_name",
      key: "panel_name",
      render: (value) => getModuleName(value),
    },
    {
      title: "Panel URL",
      dataIndex: "panel_url",
      key: "panel_id",
    },
    {
      title: "Panel Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Agent Details",
      dataIndex: "agent_username",
      key: "agent_username",
      render: (_, row) => (
        <div>
          <LabelValue label="Username" value={row.agent_username} />
          <LabelValue label="Password" value={row.agent_password} />
        </div>
      ),
    },
    ...(panel_type === "withdraw"
      ? [
        {
          title: "Assigned PG",
          dataIndex: "assigned_pg",
          key: "assigned_pg",
          render: (_, row) => (
            <div>
              <LabelValue label="Pg Label" value={row.pg_label} />
              <LabelValue label="PG Nickname" value={row.nickname} />
            </div>
          ),
        },
      ]
      : [
        {
          title: "Reject Interval",
          dataIndex: "reject_deposit_after",
          key: "reject_deposit_after",
          render: (value) =>
            value ? <LabelValue label="Reject Deposit After" value={`${value} Minutes`} /> : "Don't Reject",
        },
      ]),
    {
      title: "Assigned Users",
      dataIndex: "panel_id",
      key: "assigned_users",
      render: (value) => <AssignedUsers panel_id={value} />,
    },
    {
      title: "Transaction Stats",
      dataIndex: "panel_id",
      key: "transaction_stats",
      render: (value) => <PanelTransactionStats panel_id={value} />,
    },
    {
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
    },
    {
      title: "Update Panel",
      dataIndex: "update_panel",
      key: "update_panel",
      render: (value, row) => <Link to={`/panel/update/${row.panel_id}`}>Update {getModuleName(row.panel_name)}</Link>,
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
          id={row.panel_id}
          successMessage="Successfully switched Panel status"
          key={`${row.panel_id}_status_switch`}
        />
      ),
    },
    {
      title: "View History",
      dataIndex: "panel_id",
      key: "history",
      render: (value) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ paddingBottom: 6 }}>
            <ViewHistory id={value} type="panel" panel_id={value} />
          </div>
        </div>
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
        rowKey="panel_id"
        showHeader
        {...tableParams}
        pagination={{ ...tableParams.pagination, total }}
        style={{ width: "100%" }}
        width="100%"
      />
    </div>
  );
};

ModulesTable.defaultProps = {
  status: "enable",
};

ModulesTable.propTypes = {
  status: propTypes.string,
  panel_type: propTypes.string.isRequired,
};

export default ModulesTable;
