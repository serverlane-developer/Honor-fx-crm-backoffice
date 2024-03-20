/* eslint-disable react/forbid-prop-types */
import { Row, Table } from "antd";
import React from "react";
import propTypes from "prop-types";

import Title from "./Title";

const DataTable = ({
  columns = [],
  dataSource = [],
  onChange,
  isLoading,
  rowKey = "_id",
  showHeader,
  total,
  width = "70%",
  style,
  tableName = null,
  pagination,
  ...props
}) => (
  <>
    <Row style={{ width }}>
      {tableName && (
        <Title
          title={tableName}
          titleStyle={{
            fontSize: 24,
            fontWeight: 300,
            paddingBottom: 10,
          }}
          containerStyle={{
            marginBottom: 10,
            borderBottom: "none",
            textAlign: "left",
          }}
        />
      )}
    </Row>
    <Table
      bordered
      columns={columns}
      dataSource={dataSource}
      onChange={onChange}
      loading={isLoading}
      rowKey={rowKey}
      showHeader={showHeader}
      style={{ width, ...style }}
      {...props}
      pagination={{ total, showSizeChanger: true, ...pagination }}
      scroll={{ x: dataSource?.length ? "max-content" : null }}
    />
  </>
);
DataTable.defaultProps = {
  width: "70%",
  tableName: "",
  style: {},
  pagination: {},
  showHeader: true,
  isLoading: false,
  total: 0,
  onChange: () => {},
};
DataTable.propTypes = {
  columns: propTypes.array.isRequired,
  dataSource: propTypes.array.isRequired,
  onChange: propTypes.func,
  isLoading: propTypes.bool,
  rowKey: propTypes.string.isRequired,
  width: propTypes.oneOfType([propTypes.string, propTypes.number]),
  showHeader: propTypes.bool,
  total: propTypes.number,
  style: propTypes.any,
  tableName: propTypes.string,
  pagination: propTypes.any,
};

export default DataTable;
