import React, { useState, useEffect } from "react";
import { Card, message, Empty, Tabs } from "antd";
import lo from "lodash";
import Title from "../../../components/Title";
// import CsvModel from "./CsvModel";
import Endpoints from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import Loader from "../../../components/Loader";
import TransactionsTable from "./TransactionsTable";

const StatusTabs = [
  "pending",
  "success",
  "failed",
];

const Deposit = () => {
  // const [csvModelVisible, setCsvModelVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [panels, setPanels] = useState([]);

  const getPanels = async () => {
    const endpoint = Endpoints.GET_PANELS_FOR_DEPOSIT_TRANSACTION;
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

  useEffect(() => {
    getPanels();
  }, []);

  return (
    <>
      <Title title="Deposit list" />
      <div>
        {/* <Card style={{ marginBottom: "8px" }}>
          <Button type="primary" onClick={() => setCsvModelVisible(true)}>
            Upload CSV
          </Button>
        </Card>
        <CsvModel
          visible={csvModelVisible}
          setVisible={setCsvModelVisible}
          panel_id={1}
        /> */}
        <Card>
          {isLoading ? (
            <Loader message="Loading Panels" />
          ) : !panels.length ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="NO Panels Found"
            />
          ) : (
            <Tabs
              destroyInactiveTabPane
              type="card"
              size="large"
              tabBarGutter={4}
              style={{
                marginBottom: 12,
              }}
              items={panels.map((panel) => {
                const { panel_name, panel_url, panel_id } = panel;
                return {
                  label: lo.startCase(panel_name),
                  title: panel_url,
                  key: panel_id,
                  children: (
                    <Tabs
                      centered
                      destroyInactiveTabPane
                      items={new Array(StatusTabs.length)
                        .fill(null)
                        .map((_, i) => {
                          const status = StatusTabs[i];
                          return {
                            label: lo.startCase(status),
                            key: status,
                            children: (
                              <TransactionsTable
                                panel_id={panel_id}
                                status={status}
                                tableName="deposit"
                              />
                            ),
                          };
                        })}
                    />
                  ),
                };
              })}
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default Deposit;
