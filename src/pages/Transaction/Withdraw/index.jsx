import React, { useEffect, useState } from "react";
import { Empty, Tabs, message, Row, Button } from "antd";
import lo from "lodash";
import Title from "../../../components/Title";
import TransactionsTable from "./TransactionsTable";
import Endpoints from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import Loader from "../../../components/Loader";

const StatusTabs = ["pending", "processing", "success", "failed", "acknowledged"];

const ViewTransactions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [panels, setPanels] = useState([]);
  const [panelsStats, setPanelsStats] = useState({
    pendingCount: "--",
    processingCount: "--",
  });

  const getPanels = async () => {
    const endpoint = Endpoints.GET_PANELS_FOR_WITHDRAW_TRANSACTION;
    const url = Endpoints.BASE_URL + endpoint.url;

    try {
      setIsLoading(true);
      const { data: resData } = await callApi(endpoint.method, url);
      const { status, message: resMessage, data } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }
      setPanels([...data]);
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while getting panels";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickPanelStatsRefresh = async () => {
    const endpoint = Endpoints.GET_PANELS_STATS;
    const url = Endpoints.BASE_URL + endpoint.url;
    try {
      const { data: resData } = await callApi(endpoint.method, url);
      const { status, message: resMessage, data } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }
      setPanelsStats({
        pendingCount: data.pending.count,
        processingCount: data.processing.count,
      });
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while getting panels stats (pending/processing)";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    }
  };

  useEffect(() => {
    getPanels();
    onClickPanelStatsRefresh();
  }, []);

  return (
    <div>
      <Title title="View Transactions" />
      {isLoading ? (
        <Loader message="Loading Panels" />
      ) : !panels.length ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Panels Found" />
      ) : (
        <>
          <Row align="end" style={{ paddingRight: 10 }}>
            <Button
              onClick={() => {
                onClickPanelStatsRefresh();
              }}
            >
              Referesh Stats
            </Button>
            <div style={{ paddingLeft: 10 }}>
              <div> Pending Count: {panelsStats.pendingCount} </div>
              <div> Processing Count: {panelsStats.processingCount} </div>
            </div>
          </Row>
          <Tabs
            destroyInactiveTabPane
            type="card"
            size="large"
            tabBarGutter={4}
            style={{
              marginBottom: 12,
            }}
            items={panels.map((panel) => {
              const { panel_name, panel_url, panel_id, pg_id } = panel;
              return {
                label: lo.startCase(panel_name),
                title: panel_url,
                key: panel_id,
                children: (
                  <Tabs
                    centered
                    destroyInactiveTabPane
                    items={new Array(StatusTabs.length).fill(null).map((_, i) => {
                      const status = StatusTabs[i];
                      return {
                        label: lo.startCase(status),
                        key: status,
                        children: <TransactionsTable panel_id={panel_id} status={status} pg_id={pg_id} />,
                      };
                    })}
                  />
                ),
              };
            })}
          />
        </>
      )}
    </div>
  );
};
export default ViewTransactions;
