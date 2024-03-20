/* eslint-disable react/forbid-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { Button, Modal, Table } from "antd";
import propTypes from "prop-types";
import lo from "lodash";

import callApi from "../helpers/NetworkHelper";
import Loader from "./Loader";
import LabelValue from "./LabelValue";
import Endpoints from "../config/apiConstants";
import getAxiosError from "../helpers/getAxiosError";
import { formatTimestamp, splitAndCapitalise } from "../helpers/functions";

const DIFF_HIGHTLIGHT_COLOR = { latest: "#ffc4c4", previous: "#ffffc4" };

const historyType = propTypes.oneOf(["withdraw", "deposit", "panel"]);

const getBackgroundColor = (curr, prev, latest) => {
  const style = {
    color: "#000",
    backgroundColor: "#fff",
  };
  if (curr !== prev && curr) return DIFF_HIGHTLIGHT_COLOR.previous; // yellow
  if (curr !== latest && curr) return DIFF_HIGHTLIGHT_COLOR.latest; // red
  return style;
};

const HighlightBlock = ({ backgroundColor, size }) => (
  <div
    style={{
      backgroundColor,
      width: size,
      height: 20,
      border: "1px solid lightgrey",
      display: "inline-block",
      marginRight: 8,
    }}
  />
);
HighlightBlock.propTypes = {
  backgroundColor: propTypes.string,
  size: propTypes.number,
};
HighlightBlock.defaultProps = {
  backgroundColor: "#000",
  size: 30,
};

const flexRowCenter = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

const ViewHistory = ({ id, type, panel_id }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button onClick={() => setVisible(true)} size="large" type="primary">
        View {lo.startCase(type)} History
      </Button>
      {visible && (
        <div style={{ width: "100vw" }}>
          <Modal
            open={visible}
            onCancel={() => setVisible(false)}
            footer={null}
            centered
            width="90%"
            title={
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "90%",
                  fontSize: 20,
                }}
              >
                <LabelValue
                  label={`History For ${lo.startCase(type)} ID: `}
                  value={id}
                  valueStyle={{ fontWeight: "600" }}
                />
                <div>
                  <div style={{ ...flexRowCenter }}>
                    <HighlightBlock backgroundColor={DIFF_HIGHTLIGHT_COLOR.previous} />
                    Value different than previous version
                  </div>
                  <div style={{ ...flexRowCenter }}>
                    <HighlightBlock backgroundColor={DIFF_HIGHTLIGHT_COLOR.latest} />
                    Value different than latest version
                  </div>
                </div>
              </div>
            }
          >
            <HistoryViewer id={id} type={type} panel_id={panel_id} />
          </Modal>
        </div>
      )}
    </div>
  );
};
ViewHistory.propTypes = {
  type: historyType.isRequired,
  id: propTypes.string.isRequired,
  panel_id: propTypes.string.isRequired,
};

const getUrl = (type, id, panel_id) => {
  if (!type) throw new Error("Type is Required");
  if (!id) throw new Error("ID is Required");

  const URL_BY_TXN_TYPE = {
    withdraw: Endpoints.GET_WITHDRAW_TRANSACTION_HISTORY_BY_ID.url(panel_id),
    deposit: Endpoints.GET_DEPOSIT_TRANSACTION_HISTORY_BY_ID.url(panel_id),
    panel: Endpoints.GET_PANEL_HISTORY.url,
  };
  const endpoint = URL_BY_TXN_TYPE[type];
  if (!endpoint) throw new Error(`Transaction Type should be one of ${Object.keys(URL_BY_TXN_TYPE).join(", ")}`);

  return `${Endpoints.BASE_URL + endpoint}/${id}`;
};

const HistoryViewer = ({ id, type, panel_id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [history, setHistory] = useState(null);

  const initialise = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const url = getUrl(type, id, panel_id);
      const res = await callApi("GET", `${url}`);
      const { data } = res;
      if (data.status) {
        setHistory(data.data);
      } else {
        const { message } = data;
        setErrorMessage(message);
      }
    } catch (error) {
      console.error(`Error while fetching history with id ${id}`, error);
      const message = getAxiosError(error) || "Something went wrong while fetching history";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialise();
  }, []);

  if (isLoading) return <Loader />;
  if (errorMessage) {
    return (
      <div style={{ padding: "150px 0", minHeight: 300, maxHeight: "80vh", overflow: "auto" }}>
        <ErrorMessage message={errorMessage} />
      </div>
    );
  }

  if (!history) return <div style={{ padding: 50, textAlign: "center" }}>No Logs Found</div>;

  return (
    <div style={{ minHeight: 300, maxHeight: "80vh", overflow: "auto" }}>
      <HistoryTable history={history} />
    </div>
  );
};
HistoryViewer.propTypes = {
  id: propTypes.string.isRequired,
  type: historyType.isRequired,
  panel_id: propTypes.string.isRequired,
};

const HistoryTable = ({ history }) => {
  const dataColumns = Object.keys(history[0]);
  const latestRow = history[history.length - 1];

  const columnsToIgnore = ["version", "updated_at", "created_on"];
  const timestampColumns = ["created_at", "updated_at", "created_on"];

  const columns = dataColumns.map((col) => ({
    dataIndex: col,
    key: col,
    title: splitAndCapitalise(col),
    render: (_, row, ri) => (
      <HistoryCell
        col={col}
        columnsToIgnore={columnsToIgnore}
        history={history}
        latestRow={latestRow}
        ri={ri}
        row={row}
        timestampColumns={timestampColumns}
        key={JSON.stringify(row)}
      />
    ),
  }));

  return <Table dataSource={history} columns={columns} bordered scroll={{ x: "max-content" }} rowKey="version" />;
};
HistoryTable.propTypes = {
  history: propTypes.any.isRequired,
};

const HistoryCell = ({ col, row, history, latestRow, columnsToIgnore, ri, timestampColumns }) => {
  const curr = row[col];
  const prev = history[ri > 0 ? ri - 1 : ri][col];
  const latest = latestRow[col];

  const ignoreColumn = columnsToIgnore.includes(col);
  return (
    <div style={{ backgroundColor: ignoreColumn ? "#fff" : getBackgroundColor(curr, prev, latest) }}>
      {timestampColumns.includes(col) && curr ? formatTimestamp(curr) : curr}
    </div>
  );
};
HistoryCell.propTypes = {
  col: propTypes.string.isRequired,
  row: propTypes.string.isRequired,
  history: propTypes.string.isRequired,
  latestRow: propTypes.object.isRequired,
  columnsToIgnore: propTypes.array.isRequired,
  ri: propTypes.number.isRequired,
  timestampColumns: propTypes.array.isRequired,
};

const ErrorMessage = ({ message, fontSize }) => {
  const style = { fontSize, color: "red" };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <span style={style}>{message}</span>
    </div>
  );
};
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
  fontSize: propTypes.number,
};
ErrorMessage.defaultProps = {
  fontSize: 24,
};

export default ViewHistory;
