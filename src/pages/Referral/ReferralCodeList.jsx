import React, { useEffect, useState } from "react";
import { Button, Col, Input, Row, Tooltip, message } from "antd";
import { SyncOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";
import apiConstants from "../../config/apiConstants";
import Loader from "../../components/Loader";
import { objectToQueryString } from "../../helpers/url";
import LabelValue from "../../components/LabelValue";
import ReferralCode from "./ReferralCode";
import { formatTimestamp } from "../../helpers/functions";
import DataTable from "../../components/DataTable";

const ReferralCodeList = () => {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 50,
    },
    scroll: {
      y: 800,
    },
  });

  const getList = async ({ orderBy, dir, limit, skip } = {}) => {
    try {
      const { pageSize, current } = tableParams.pagination;

      const data = {
        orderBy,
        dir,
        skip: skip || current * pageSize - pageSize,
        limit: limit || pageSize,
        search,
      };
      let queryString = objectToQueryString(data);
      if (queryString) queryString = `?${queryString}`;

      const endpoint = apiConstants.GET_REFERRAL_LIST;
      const url = `${apiConstants.BASE_URL + endpoint.url}/${queryString}`;

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
      const res = await getList();
      setList(res?.data?.data || []);
      const count = Number(res.headers["x-total-count"] || 0);
      setTotal(count);
    } catch (error) {
      message.error(getAxiosError(error) || "Error while fetching referral list");
      console.error("Error while fetching referral list", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSearchChange = (e) => setSearch(e?.target?.value);

  useEffect(() => {
    initialise();
  }, [tableParams.pagination]);

  const columns = [
    {
      title: "Sr No",
      dataIndex: "i",
      key: "transaction_id",
      render: (__, ___, i) => tableParams.pagination.pageSize * (tableParams.pagination.current - 1) + i + 1,
    },
    {
      title: "Admin User",
      dataIndex: "username",
      key: "username",
      render: (_, row) => (
        <div>
          <LabelValue label="Username: " value={row.username} />
          <LabelValue label="Email: " value={row.email} />
        </div>
      ),
    },
    {
      title: "Referral Code",
      dataIndex: "referral_code",
      key: "referral_code",
      render: (cell) => <ReferralCode code={cell} />,
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
    {
      title: "View Customers",
      dataIndex: "referral_code",
      key: "referral_code",
      render: (value, row) => (
        <Link
          to={`/referral/${value}/${row.referral_id}`}
          target="_blank"
          rel="noopener noreferrer"
          title="View Customers Registered with this code"
        >
          <strong>{row.customer_count}</strong> Customers
        </Link>
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

  if (isLoading) {
    return <Loader message="Loading Transactions..." padding={50} size={24} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Row justify="space-between" align="middle" style={{ padding: "12px 0" }}>
        <Col span={12} style={{ fontWeight: 600, fontSize: 16 }}>
          [{total}] Referral Codes
          <Tooltip title="Refresh List">
            <Button icon={<SyncOutlined />} onClick={initialise} style={{ marginLeft: 12 }} type="primary" />
          </Tooltip>
        </Col>
        <Col span={6} style={{ textAlign: "right" }}>
          <Input.Search
            loading={isLoading}
            placeholder="Search Phone Number"
            value={search}
            onChange={onSearchChange}
            onSearch={initialise}
            style={{
              width: "100%",
            }}
            size="large"
          />
        </Col>
      </Row>
      <DataTable
        bordered
        columns={columns}
        dataSource={list}
        onChange={handleTableChange}
        loading={isLoading}
        rowKey="referral_id"
        showHeader
        {...tableParams}
        pagination={{ ...tableParams.pagination, total }}
        style={{ width: "100%" }}
        width="100%"
      />
    </div>
  );
};

export default ReferralCodeList;
