import React from "react";
import { Collapse, Row } from "antd";
import Title from "../../components/Title";
import ProfileCard from "./ProfileCard";
import LoginHistory from "./LoginHistory";
import UpdatePassword from "./UpdatePassword";
import ToggleTwoFactorAuth from "./ToggleTwoFactorAuth";

const items = [
  {
    key: "2fa",
    label: "Two factor Authentication",
    children: <ToggleTwoFactorAuth />,
  },
  { key: "login-history", label: "Login History", children: <LoginHistory /> },
];

const Profile = () => (
  <div>
    <Row align="middle" justify="space-between">
      <Title title="Your Profile" containerStyle={{ borderBottom: "none" }} />
      <UpdatePassword isModal />
    </Row>
    <div style={{ padding: 8 }}>
      <ProfileCard />
    </div>

    <div style={{ padding: 8 }}>
      <Collapse items={items} size="large" />
    </div>
  </div>
);

export default Profile;
