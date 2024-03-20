import React from "react";
import propTypes from "prop-types";
import { Checkbox, Form, Select } from "antd";

import DataTable from "../../../../components/DataTable";

const PreviewTable = ({
  data,
  formName,
  colSelection,
  colChange,
  setColChange,
  setUtrCalculation,
}) => {
  //   console.log("PreviewTable mount>>>>>", colChange);
  const tableColumns = [
    // {
    //   title: "Sr No",
    //   dataIndex: "i",
    //   key: "transaction_id",
    //   render: (__, ___, i) => i + 1,
    // },
    {
      title: (
        <NameTitle
          formName={formName}
          colSelection={colSelection}
          colChange={colChange}
          setColChange={setColChange}
        />
      ),
      width: "200px",
      dataIndex: "name",
      key: "name",
      render: (__, row) => row.name,
    },
    {
      title: (
        <AccTitle
          formName={formName}
          colSelection={colSelection}
          colChange={colChange}
          setColChange={setColChange}
        />
      ),
      width: "200px",
      dataIndex: "amount",
      key: "amount",
      render: (__, row) => row.amount,
    },
    {
      title: (
        <DateTitle
          formName={formName}
          colSelection={colSelection}
          colChange={colChange}
          setColChange={setColChange}
        />
      ),
      width: "200px",
      dataIndex: "date",
      key: "date",
      render: (__, row) => row.date,
    },
    {
      title: (
        <UtrTitle
          formName={formName}
          colSelection={colSelection}
          colChange={colChange}
          setColChange={setColChange}
          setUtrCalculation={setUtrCalculation}
        />
      ),
      width: "200px",
      dataIndex: "utr",
      key: "utr",
      render: (__, row) => row.utr,
    },
  ];
  return (
    <>
      {" "}
      <DataTable
        bordered
        columns={tableColumns}
        dataSource={data}
        // onChange={handleTableChange}
        // loading={loading}
        rowKey="transaction_id"
        showHeader
        // {...tableParams}
        // pagination={{ ...tableParams.pagination, total }}
        pagination={false}
        style={{ width: "100%" }}
        width="100%"
      />
    </>
  );
};

PreviewTable.propTypes = {
  data: propTypes.shape([
    {
      name: propTypes.string.isRequired,
      amount: propTypes.string.isRequired,
      date: propTypes.string.isRequired,
      utr: propTypes.string.isRequired,
    },
  ]).isRequired,
  formName: propTypes.string.isRequired,
  colSelection: propTypes.shape([
    { value: propTypes.string.isRequired, label: propTypes.string.isRequired },
  ]).isRequired,
  colChange: propTypes.bool.isRequired,
  setColChange: propTypes.func.isRequired,
  setUtrCalculation: propTypes.bool.isRequired,
};

const NameTitle = ({ formName, colSelection, colChange, setColChange }) => {
  //   console.log("NameTitle mount>>>>>", colChange);
  return (
    <>
      <h3 style={{ textAlign: "center", backgroundColor: "#d3d3d3" }}>Name</h3>
      <span style={{ fontSize: "12px" }}>Edit Name Column</span>
      <Form.Item
        // label="Edit Name Column"
        name={`${formName.toLowerCase()}_name`}
        // rules={[
        //   {
        //     required: true,
        //     message: `Please select Name!`,
        //   },
        // ]}
        shouldUpdate
      >
        <Select
          options={colSelection}
          onChange={() => {
            setColChange(!colChange);
            // console.log("on change run", colChange);
          }}
        />
      </Form.Item>
      <span style={{ visibility: "hidden" }}>empty space</span>
    </>
  );
};
const AccTitle = ({ formName, colSelection, colChange, setColChange }) => {
  return (
    <>
      <h3 style={{ textAlign: "center", backgroundColor: "#d3d3d3" }}>
        Amount
      </h3>
      <span style={{ fontSize: "12px" }}>edit amount column</span>
      <Form.Item
        // label="Amount"
        name={`${formName.toLowerCase()}_amount`}
        // rules={[
        //   {
        //     required: true,
        //     message: `Please select Amount!`,
        //   },
        // ]}
        shouldUpdate
      >
        <Select
          options={colSelection}
          onChange={() => {
            setColChange(!colChange);
            // console.log("on change run", colChange);
          }}
        />
      </Form.Item>
      <span style={{ visibility: "hidden" }}>empty space</span>
    </>
  );
};
const DateTitle = ({ formName, colSelection, colChange, setColChange }) => {
  return (
    <>
      <h3 style={{ textAlign: "center", backgroundColor: "#d3d3d3" }}>Date</h3>
      <span style={{ fontSize: "12px" }}>edit date column</span>
      <Form.Item
        // label="Date"
        name={`${formName.toLowerCase()}_date`}
        // rules={[
        //   {
        //     required: true,
        //     message: `Please select Date!`,
        //   },
        // ]}
        shouldUpdate
      >
        <Select
          options={colSelection}
          onChange={() => {
            setColChange(!colChange);
            // console.log("on change run", colChange);
          }}
        />
      </Form.Item>
      <span style={{ visibility: "hidden" }}>empty space</span>
    </>
  );
};
const UtrTitle = ({
  formName,
  colSelection,
  colChange,
  setColChange,
  setUtrCalculation,
}) => {
  return (
    <>
      <h3 style={{ textAlign: "center", backgroundColor: "#d3d3d3" }}>UTR</h3>
      <span style={{ fontSize: "12px" }}>edit utr column</span>
      <Form.Item
        // label="UTR"
        name={`${formName.toLowerCase()}_utr`}
        // rules={[
        //   {
        //     required: true,
        //     message: `Please select UTR!`,
        //   },
        // ]}
        shouldUpdate
      >
        <Select
          options={colSelection}
          onChange={() => {
            setColChange(!colChange);
            // console.log("on change run", colChange);
          }}
        />
      </Form.Item>
      <Checkbox
        defaultChecked
        onChange={(e) => {
          setUtrCalculation(e.target.checked);
        }}
      />
      {"  "}
      <span style={{ fontSize: "12px" }}>Get utr from name</span>
    </>
  );
};

NameTitle.propTypes = {
  formName: propTypes.string.isRequired,
  colSelection: propTypes.shape([
    { value: propTypes.string.isRequired, label: propTypes.string.isRequired },
  ]).isRequired,
  colChange: propTypes.bool.isRequired,
  setColChange: propTypes.func.isRequired,
};
AccTitle.propTypes = {
  formName: propTypes.string.isRequired,
  colSelection: propTypes.shape([
    { value: propTypes.string.isRequired, label: propTypes.string.isRequired },
  ]).isRequired,
  colChange: propTypes.bool.isRequired,
  setColChange: propTypes.func.isRequired,
};
DateTitle.propTypes = {
  formName: propTypes.string.isRequired,
  colSelection: propTypes.shape([
    { value: propTypes.string.isRequired, label: propTypes.string.isRequired },
  ]).isRequired,
  colChange: propTypes.bool.isRequired,
  setColChange: propTypes.func.isRequired,
};
UtrTitle.propTypes = {
  formName: propTypes.string.isRequired,
  colSelection: propTypes.shape([
    { value: propTypes.string.isRequired, label: propTypes.string.isRequired },
  ]).isRequired,
  colChange: propTypes.bool.isRequired,
  setColChange: propTypes.func.isRequired,
  setUtrCalculation: propTypes.bool.isRequired,
};

export default PreviewTable;
