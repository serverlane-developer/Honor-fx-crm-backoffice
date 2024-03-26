import React, { useEffect, useState } from "react";
import { message, Collapse } from "antd";
import { useParams } from "react-router-dom";
import Title from "../../../components/Title";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import Loader from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";
import Description from "../../../components/Description";
import UserLoginHistory from "./UserLoginHistory";
import UserTransactions from "./UserTransactions";
import Mt5UsersList from "./Mt5UsersList";

const CustomerProfile = () => {
  const { customer_id } = useParams();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCustomerProfile = async () => {
    try {
      const endpoint = apiConstants.GET_USER_BY_ID;
      const url = `${apiConstants.BASE_URL}${endpoint.url}/${customer_id}`;

      const response = await callApi(endpoint.method, url);

      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const collapseItems = [
    {
      key: "profile",
      label: "Profile",
      children: <Description items={profile} title="" />,
    },
    {
      key: "login-history",
      label: "Login History",
      children: <UserLoginHistory />,
    },
    {
      key: "mt5-users",
      label: "MT5 Users",
      children: <Mt5UsersList customer_id={customer_id} />,
    },
    {
      key: "transactions",
      label: "Transactions",
      children: <UserTransactions customer_id={customer_id} />,
    },
  ];

  useEffect(() => {
    const initialise = async () => {
      try {
        setIsLoading(true);
        const res = await getCustomerProfile();
        setProfile(res.data || null);
      } catch (error) {
        message.error(getAxiosError(error) || "Error while fetching modules");
        console.error("Error while fetching modules", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialise();
  }, []);

  if (!customer_id) return <ErrorMessage message="Customer ID is required" />;

  if (isLoading) return <Loader message="Loading Customer Profile..." />;

  if (!profile) return <ErrorMessage message="User not Found" />;

  return (
    <div>
      <Title title="Customer Profile" />
      {/* <Description items={profile} title="Profile" /> */}

      <div style={{ padding: 8 }}>
        <Collapse
          items={collapseItems}
          size="large"
          destroyInactivePanel
          defaultActiveKey={["profile"]}
          // activeKey={["profile"]}
        />
      </div>
    </div>
  );
};

export default CustomerProfile;
