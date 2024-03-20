import React, { useEffect, useState } from "react";
import { Alert } from "antd";

import apiConstants from "../../config/apiConstants";

import callApi from "../../helpers/NetworkHelper";
import getAxiosError from "../../helpers/getAxiosError";
import Loader from "../../components/Loader";
import Description from "../../components/Description";

const profileInit = {
  username: "",
  email: "",
  mobile: "",
  last_login_ip: "",
  last_login_timestamp: null,
  enable_two_factor_auth: false,
  password_changed_at: null,
  created_at: "",
};

const ProfileCard = () => {
  const [profile, setProfile] = useState(profileInit);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setprofileError] = useState("");

  const getProfileInfo = async () => {
    try {
      setIsProfileLoading(true);
      const endpoint = apiConstants.PROFILE;
      const url = apiConstants.BASE_URL + endpoint.url;
      const res = await callApi(endpoint.method, url);
      const userData = res?.data?.data;
      setProfile({ ...userData });
    } catch (error) {
      const message = "Error while fetching profile info";
      console.error(message, error);
      setprofileError(getAxiosError(error) || message);
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    getProfileInfo();
  }, []);

  if (isProfileLoading) return <Loader />;
  if (profileError) {
    return <Alert message="Error Text" showIcon description={profileError} type="error" closable />;
  }
  return (
    <div>
      <Description items={profile} title="Profile" />
    </div>
  );
};

export default ProfileCard;
