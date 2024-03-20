import React, { useState } from "react";
import propTypes from "prop-types";
import { Modal } from "antd";

import DataTable from "../../../../components/DataTable";

const ShowTransationModal = ({ data, visible, setVisible }) => {
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    scroll: {
      y: 800,
    },
  });
  const total = data.length;

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
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (__, row) => row.name,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (__, row) => row.amount,
    },
    {
      title: "UTR",
      dataIndex: "utr",
      key: "utr",
      render: (__, row) => row.utr,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (__, row) => row.date,
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
    <Modal
      title="CSV Details"
      open={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      footer={false}
      width={1000}
    >
      <DataTable
        bordered
        columns={tableColumns}
        dataSource={data}
        onChange={handleTableChange}
        rowKey="transaction_id"
        showHeader
        {...tableParams}
        pagination={{ ...tableParams.pagination, total }}
        style={{ width: "100%" }}
        width="100%"
      />
    </Modal>
  );
};

ShowTransationModal.propTypes = {
  data: propTypes.arrayOf(
    propTypes.shape({
      amount: propTypes.string,
      date: propTypes.string,
      name: propTypes.string,
      utr: propTypes.string,
    })
  ).isRequired,
  visible: propTypes.bool.isRequired,
  setVisible: propTypes.func.isRequired,
};

export default ShowTransationModal;
