import React, { useEffect, useState } from "react";
import moment from "moment";

import { Tag, message } from "antd";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";

import getAxiosError from "../../../helpers/getAxiosError";

import Loader from "../../../components/Loader";
import DataTable from "../../../components/DataTable";
import appConstants from "../../../config/appConstants";
import { objectToQueryString } from "../../../helpers/url";
import ConfirmSwitch from "../../../components/ConfirmSwitch";
import LabelValue from "../../../components/LabelValue";
import ViewBalance from "./ViewBalance";

const getPaymentMethodColumn = (method = "imps") => {
  if (!["imps", "neft", "rtgs"].includes(method)) return {};

  return {
    title: method.toUpperCase(),
    dataIndex: method,
    key: method,
    render: (_, row) => {
      const enabled = row[`${method}_enabled`];
      const min = row[`${method}_min`];
      const max = row[`${method}_max`];
      return (
        <div>
          <div style={{ color: enabled ? "green" : "red", fontWeight: "bold" }}>
            {enabled ? "Enabled" : "Disabled"}
          </div>
          {/* <LabelValue
            label=""
            value={<span style={{ color: enabled ? "green" : "red" }}>{enabled ? "Enabled" : "Disabled"}</span>}
          /> */}
          <LabelValue label="Min" value={String(min)} />
          <LabelValue label="Max" value={String(max)} />
        </div>
      );
    },
  };
};

const PaymentGatewayTable = ({ status }) => {
  const [list, setList] = useState([]);
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
    const getPaymentGatewayUsers = async ({
      orderBy,
      dir,
      limit,
      skip,
    } = {}) => {
      try {
        const { pageSize, current } = tableParams.pagination;

        const data = {
          orderBy,
          dir,
          skip: skip || current * pageSize - pageSize,
          limit: limit || pageSize,
          status,
        };
        let queryString = objectToQueryString(data);
        if (queryString) queryString = `?${queryString}`;

        const endpoint = apiConstants.GET_PAYMENT_GATEWAYS;
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
        const res = await getPaymentGatewayUsers();
        setList(res?.data?.data || []);
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
    const endpoint = apiConstants.DELETE_PAYMENT_GATEWAY;
    const url = `${apiConstants.BASE_URL}${endpoint.url}/${id}`;
    const { data } = await callApi(endpoint.method, url, {
      is_deleted: isDeleted,
    });
    return data;
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "pg_id",
      key: "sr_no",
      render: (__, ___, i) =>
        tableParams.pagination.pageSize * (tableParams.pagination.current - 1) +
        i +
        1,
    },
    {
      title: "Label",
      dataIndex: "pg_label",
      key: "pg_label",
    },
    {
      title: "Nickname",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Payout Service",
      dataIndex: "pg_service",
      key: "pg_service",
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: "View Balance",
      dataIndex: "pg_id",
      key: "pg_balance",
      render: (value) => <ViewBalance pgId={value} />,
    },
    {
      title: "Threshold",
      dataIndex: "threshold_limit",
      key: "threshold_limit",
    },
    getPaymentMethodColumn("imps"),
    getPaymentMethodColumn("neft"),
    getPaymentMethodColumn("rtgs"),
    {
      title: "Timestamps",
      dataIndex: "created_at",
      key: "created_at",
      render: (____, row) => (
        <div>
          <LabelValue label="Created By:" value={row.created_by} />
          {row.created_at && (
            <LabelValue
              label="Created At:"
              value={moment(row.created_at).format(appConstants.dateFormat)}
            />
          )}
          <LabelValue label="Updated By:" value={row.updated_by} />
          {row.updated_at && (
            <LabelValue
              label="Updated At:"
              value={moment(row.updated_at).format(appConstants.dateFormat)}
            />
          )}
        </div>
      ),
    },
    {
      title: "Update Payment gateway",
      dataIndex: "pg_id",
      key: "pg_id",
      render: (value, row) => (
        <Link to={`/paymentgateway/update/${value}`}>
          Update {row.pg_label}
        </Link>
      ),
    },

    {
      title: "Toggle Status",
      dataIndex: "is_deleted",
      key: "is_deleted",
      render: (value, row) => (
        <ConfirmSwitch
          module="payment gateway"
          initialState={value}
          onToggle={onStatusToggle}
          id={row.pg_id}
          successMessage="Successfully switched gateway status"
          key={`${row.pg_id}_status_switch`}
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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <DataTable
        bordered
        columns={columns}
        dataSource={list}
        onChange={handleTableChange}
        loading={isLoading}
        rowKey="pg_id"
        showHeader
        {...tableParams}
        pagination={{ ...tableParams.pagination, total }}
        style={{ width: "100%" }}
        width="100%"
      />
    </div>
  );
};

PaymentGatewayTable.defaultProps = {
  status: "enable",
};
PaymentGatewayTable.propTypes = {
  status: propTypes.string,
};

export default PaymentGatewayTable;
