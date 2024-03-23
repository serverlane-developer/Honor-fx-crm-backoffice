import React, { useEffect, useState } from "react";
import { Col, Row, message } from "antd";
import { SyncOutlined, LoadingOutlined } from "@ant-design/icons";
import callApi from "../../helpers/NetworkHelper";
import Endpoints from "../../config/apiConstants";
import getAxiosError from "../../helpers/getAxiosError";

const initialData = {
  withdraw: "0.00",
  deposit: "0.00",
  turnover: "0.00",
};

const DailyTurnover = () => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const getTurnover = async (refresh = false) => {
    try {
      setIsLoading(true);
      const endpoint = Endpoints.GET_DAILY_TURNOVER;
      let url = `${Endpoints.BASE_URL}${endpoint.url}`;
      if (refresh) url += "?refresh=true";
      const res = await callApi(endpoint.method, url);
      const dataRes = res?.data?.data;
      setData(dataRes);
    } catch (error) {
      const errMessage = "Error while fetching profile info";
      console.error(errMessage, error);
      message.error(getAxiosError(error) || errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTurnover();
  }, []);

  return (
    <Row style={{ textAlign: "center" }} align="middle" justify="end">
      <Col>
        {isLoading ? (
          <Col style={{ textAlign: "center" }}>
            <LoadingOutlined style={{ fontSize: 20 }} />
          </Col>
        ) : (
          <div>
            <Row align="middle" justify="center" style={{ padding: 6 }}>
              <div style={{ fontSize: 20, fontWeight: "bold" }} title="Deposit - Withdraw = Turnover">
                Daily Turnover
              </div>
            </Row>
            <Row justify="center" align="middle" style={{ padding: 6 }}>
              <Col
                style={{
                  fontSize: 20,
                  fontWeight: 300,
                  padding: "0px 4px",
                }}
                title="Deposit"
              >
                {data.deposit}
              </Col>
              <span style={{ padding: "0px 4px", fontWeight: "bold" }}>-</span>
              <Col
                style={{
                  fontSize: 20,
                  fontWeight: 300,
                  padding: "0px 4px",
                }}
                title="Withdraw"
              >
                {data.withdraw}
              </Col>
              <span style={{ padding: "0px 4px", fontWeight: "bold" }}>=</span>
              <Col
                style={{
                  fontSize: 20,
                  fontWeight: 300,
                  padding: "0px 4px",
                  color: data.turnover < 0 ? "red" : data.turnover > 0 ? "green" : "black",
                }}
                title="Turnover"
              >
                {data.turnover}
              </Col>
            </Row>
          </div>
        )}
      </Col>
      <Col style={{ paddingLeft: 12 }}>
        <SyncOutlined onClick={() => getTurnover(true)} style={{ fontSize: 20 }} title="Show Balance" />
      </Col>
    </Row>
  );
};

export default DailyTurnover;
