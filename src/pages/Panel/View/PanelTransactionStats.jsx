import React, { useState } from "react";
import propTypes from "prop-types";
import { Button, message } from "antd";
import lo from "lodash";

import Constants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import LabelValue from "../../../components/LabelValue";

const PanelTransactionStats = ({ panel_id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const getStats = async () => {
    const endpoint = Constants.GET_PANEL_TRANSACTION_STATS;
    const url = `${Constants.BASE_URL + endpoint.url}/${panel_id}`;
    try {
      setIsLoading(true);
      const { data: resData } = await callApi(endpoint.method, url);
      const { status, message: resMessage, data } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }
      const users = data || [];
      setStats({ ...users });
      setIsVisible(true);
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while getting assigned users for panel";
      console.error(errMessage, panel_id, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const hideList = () => setIsVisible(false);

  return (
    <div>
      <Button loading={isLoading} onClick={isVisible ? hideList : getStats} type="primary">
        {isVisible ? "Hide" : "Show"}
      </Button>
      <div style={{ paddingTop: 12 }}>
        {isVisible &&
          (stats ? (
            Object.keys(stats).map((status) => (
              <div key={status}>
                <LabelValue label={lo.startCase(status)} value={stats[status]} />
              </div>
            ))
          ) : (
            <div>No Result</div>
          ))}
      </div>
    </div>
  );
};
PanelTransactionStats.propTypes = {
  panel_id: propTypes.string.isRequired,
};

export default PanelTransactionStats;
