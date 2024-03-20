import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { useLocation, useParams } from "react-router-dom";

import LabelValue from "../../../../components/LabelValue";
import getAxiosError from "../../../../helpers/getAxiosError";
import apiConstants from "../../../../config/apiConstants";
import callApi from "../../../../helpers/NetworkHelper";
import { objectToQueryString } from "../../../../helpers/url";
import DataTable from "../../../../components/DataTable";
import ShowTransationModal from "./ShowTransationModal";

const CsvStatements = () => {
  const { panel_id } = useParams();
  const location = useLocation();
  let [status] = location.search.substring(1).split("&");
  [, status] = status.split("=");
  console.log("status", status);
  const [tansaction, setTranaction] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    scroll: {
      y: 800,
    },
  });
  const [showTransactionModalVisible, setShowTransactionModalVisible] =
    useState(false);
  const [showTransationData, setShowTransationData] = useState([]);

  const getTransactions = async ({ sort, pageNum, limit } = {}) => {
    try {
      // const { pageSize, current } = tableParams.pagination;
      // http://localhost:5001/api/v1/transaction/deposit/4713d5ed-02b0-4b59-9a68-08d02ea39020/pending?limit=50
      // http://localhost:5001/api/v1/transaction/deposit/4713d5ed-02b0-4b59-9a68-08d02ea39020/csv-statement/pending?sort=-1&pageNum=1
      setIsLoading(true);
      const queiryData = {
        sort: sort || -1,
        pageNum: pageNum || 1,
        limit: limit || 10,
      };
      let queryString = objectToQueryString(queiryData);
      if (queryString) queryString = `?${queryString}`;

      const endpoint = apiConstants.SHOW_CSV_STATEMENT;
      const url = `${
        apiConstants.BASE_URL + endpoint.url(panel_id)
      }/${queryString}`;

      const { data: resData } = await callApi(endpoint.method, url);
      const {
        status: resStatus,
        data,
        totalData: count,
        message: resMessage,
      } = resData;
      if (!resStatus) {
        message.error(resMessage);
        return;
      }
      setTranaction(data);
      setTotal(count);
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while getting panels";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTransactions({ pageNum: tableParams.pagination.current });
  }, [tableParams.pagination]);

  const tableColumns = [
    {
      title: "Sr No",
      dataIndex: "i",
      key: "transaction_id",
      render: (__, ___, i) =>
        tableParams.pagination.pageSize * (tableParams.pagination.current - 1) +
        i +
        1,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (__, data) => data.date,
    },
    {
      title: "File Name",
      dataIndex: "filename",
      key: "filename",
      render: (__, data) => data.filename,
    },
    {
      title: "Transaction Details",
      dataIndex: "transaction_details",
      key: "transaction_details",
      render: (__, data) => (
        <>
          <LabelValue label="Create By" value={data.created_by} />
          <LabelValue label="Create At" value={data.createdAt} />
          <LabelValue label="Update By" value={data.updated_by} />
          <LabelValue label="Update At" value={data.updatedAt} />
        </>
      ),
    },
    {
      title: "Show Transaction",
      dataIndex: "show_tansaction",
      key: "show_tansaction",
      render: (__, data) => (
        <Button
          type="primary"
          onClick={() => {
            setShowTransactionModalVisible(true);
            setShowTransationData(data.transactions);
          }}
        >
          Show Transaction
        </Button>
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

  return (
    <div>
      <DataTable
        bordered
        columns={tableColumns}
        dataSource={tansaction}
        onChange={handleTableChange}
        loading={loading}
        rowKey="transaction_id"
        showHeader
        {...tableParams}
        pagination={{ ...tableParams.pagination, total }}
        style={{ width: "100%" }}
        width="100%"
      />
      {showTransactionModalVisible && (
        <ShowTransationModal
          data={showTransationData}
          visible={showTransactionModalVisible}
          setVisible={setShowTransactionModalVisible}
        />
      )}
    </div>
  );
};

export default CsvStatements;
