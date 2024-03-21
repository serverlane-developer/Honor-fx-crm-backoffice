/* eslint-disable no-nested-ternary */
import React, { useState } from "react";
import propTypes from "prop-types";
import { Col, Row, message } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, LoadingOutlined } from "@ant-design/icons";
import getAxiosError from "../../../../helpers/getAxiosError";
import Endpoints from "../../../../config/apiConstants";
import callApi from "../../../../helpers/NetworkHelper";

const ViewBalance = ({ pgId }) => {
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const hideBalance = () => setShowBalance(false);

  const getBalance = async () => {
    try {
      setShowBalance(true);
      setIsLoading(true);
      const endpoint = Endpoints.GET_PAYOUT_GATEWAY_BALANCE;
      const url = `${Endpoints.BASE_URL}${endpoint.url}/${pgId}`;
      const res = await callApi(endpoint.method, url);
      const balanceRes = Number(res?.data?.data?.balance || 0).toFixed(2);
      setBalance(balanceRes);
    } catch (error) {
      const errMessage = "Error while fetching profile info";
      console.error(errMessage, error);
      message.error(getAxiosError(error) || errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Col style={{ textAlign: "center" }}>
      {showBalance && (
        <Col>
          {isLoading ? (
            <Col style={{ textAlign: "center" }}>
              <LoadingOutlined style={{ fontSize: 20 }} />
            </Col>
          ) : (
            <Row justify="center" align="middle">
              <Col
                style={{
                  fontSize: 20,
                  fontWeight: 300,
                }}
              >
                {balance}
              </Col>
            </Row>
          )}
        </Col>
      )}
      <Col style={{ paddingTop: 6 }}>
        {showBalance ? (
          <EyeInvisibleOutlined onClick={hideBalance} style={{ fontSize: 20 }} title="Hide Balance" />
        ) : (
          <EyeOutlined onClick={getBalance} style={{ fontSize: 20 }} title="Show Balance" />
        )}
      </Col>
    </Col>
  );
};
ViewBalance.propTypes = {
  pgId: propTypes.string.isRequired,
};

export default ViewBalance;
