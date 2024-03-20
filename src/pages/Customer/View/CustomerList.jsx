import React, { useEffect, useState } from "react";
// import moment from "moment";
import { message } from "antd";
import { Link } from "react-router-dom";
// import propTypes from "prop-types";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import Loader from "../../../components/Loader";
import DataTable from "../../../components/DataTable";
import { objectToQueryString } from "../../../helpers/url";
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
          // panel_id
        };
        let queryString = objectToQueryString(data);
        if (queryString) queryString = `?${queryString}`;

        const endpoint = apiConstants.GET_CUSTOMERS;
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
        const res = await getModules({});
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
    const endpoint = apiConstants.FLAG_CUSTOMER;
    const url = `${apiConstants.BASE_URL}${endpoint.url}/${id}`;
    const { data } = await callApi(endpoint.method, url, { is_flagged: !isDeleted });
    return data;
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "customer_id",
      key: "customer_id",
      render: (__, ___, i) => tableParams.pagination.pageSize * (tableParams.pagination.current - 1) + i + 1,
    },
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "account",
      dataIndex: "account_name",
      key: "account_name",
    },
    {
      title: "Total Withdraw Transactions",
      dataIndex: "total_withdraw_transactions",
      key: "total_withdraw_transactions",
    },
    {
      title: "Total Withdraw Amount",
      dataIndex: "total_withdraw_amount",
      key: "total_withdraw_amount",
    },
    {
      title: "Total Deposit Transactions",
      dataIndex: "total_deposit_transactions",
      key: "total_deposit_transactions",
    },
    {
      title: "Total Deposit Amount",
      dataIndex: "total_deposit_amount",
      key: "total_deposit_amount",
    },
    {
      title: "View Profile",
      dataIndex: "update_module",
      key: "update_module",
      render: (value, row) => (
        <Link to={`/Customer/profile/${row.customer_id}`}>View Profile</Link>
      ),
    },
    {
      title: "Flagged",
      dataIndex: "is_flagged",
      key: "is_flagged",
      render: (value, row) => (
        <ConfirmSwitch
          module="flag"
          initialState={!value}
          onToggle={onStatusToggle}
          id={row.customer_id}
          successMessage="Successfully switched module status"
          key={`${row.customer_id}_status_switch`}
          checkedLabel="Flagged"
          uncheckedLabel="Un-Flagged"
        />
      ),
    }
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

ModulesTable.propTypes = {
  // panel_id: propTypes.string.isRequired,
};

export default ModulesTable;
