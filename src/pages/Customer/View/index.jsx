import React, { useEffect, useState } from "react";
import { Empty, message } from "antd";
// import lo from "lodash";
import Title from "../../../components/Title";
import CustomerList from "./CustomerList";
import Endpoints from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import Loader from "../../../components/Loader";
import DailyTurnover from "../DailyTurnover";

const ViewTransactions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [panels, setPanels] = useState([]);

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

  useEffect(() => {
    getPanels();
  }, []);

  return (
    <div>
      <Title title="View Customers" />

      <DailyTurnover />

      {isLoading ? (
        <Loader message="Loading Panels" />
      ) : !panels.length ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="NO Panels Found"
        />
      ) : (
        // <Tabs
        //   destroyInactiveTabPane
        //   type="card"
        //   size="large"
        //   tabBarGutter={4}
        //   style={{
        //     marginBottom: 12,
        //   }}
        //   items={panels.map((panel) => {
        //     const { panel_name, panel_url, panel_id } = panel;
        //     return {
        //       label: lo.startCase(panel_name),
        //       title: panel_url,
        //       key: panel_id,
        //       children: (
        //         <CustomerList
        //           panel_id={panel_id}
        //         />
        //       ),
        //     };
        //   })}
        // />
        <CustomerList />
      )}
    </div>
  );
};
export default ViewTransactions;
