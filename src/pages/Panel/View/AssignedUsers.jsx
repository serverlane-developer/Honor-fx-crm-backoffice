import React, { useState } from "react";
import propTypes from "prop-types";
import { Button, Empty, List, message } from "antd";
import Constants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";

const AssignedUsers = ({ panel_id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const getAssignedUsers = async () => {
    const endpoint = Constants.GET_ASSIGNED_USERS_BY_PANEL_ID;
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
      setAssignedUsers([...users]);
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
      <Button loading={isLoading} onClick={isVisible ? hideList : getAssignedUsers} type="primary">
        {isVisible ? "Hide" : "Show"}
      </Button>
      <div style={{ paddingTop: 12 }}>
        {isVisible &&
          (assignedUsers.length ? (
            <List
              size="small"
              bordered
              rowKey={(item) => item.user_id}
              dataSource={assignedUsers}
              renderItem={(item) => (
                <List.Item>
                  {item.username} - {item.email}
                </List.Item>
              )}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ))}
      </div>
    </div>
  );
};
AssignedUsers.propTypes = {
  panel_id: propTypes.string.isRequired,
};

export default AssignedUsers;
