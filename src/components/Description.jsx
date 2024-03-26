/* eslint-disable no-unused-vars */
/* eslint-disable react/forbid-prop-types */
import { Descriptions } from "antd";
import _ from "lodash";
import moment from "moment";
import React from "react";
import propTypes from "prop-types";
import appConstants from "../config/appConstants";

const timestampKeys = [
  "created_at",
  "updated_at",
  "verified_at",
  "password_changed_at",
  "last_login_timestamp",
  "two_factor_toggled_at",
];
const booleanKeys = ["enable_two_factor_auth", "is_2fa_enabled", "is_pin_reset_required"];

const getDescriptionValue = (key, value) => {
  if (timestampKeys.includes(key)) {
    return value && moment(value).isValid() ? moment(value).format(appConstants.dateFormat) : "Never";
  }
  if (booleanKeys.includes(key)) {
    return value ? "Yes" : "No";
  }
  if (_.isObject(value)) {
    return JSON.stringify(value, null, 2);
  }
  return value;
};

const getDescriptionItems = (profile) => {
  const items = Object.keys(profile).map((x) => ({
    key: x,
    label: _.startCase(x.split("_").join(" ")),
    children: getDescriptionValue(x, profile[x]),
  }));

  return items;
};

// const Description = ({ items, title, layout, columns }) =>
//   items ? <Descriptions title={title} bordered items={getDescriptionItems(items)} column={columns} layout={layout} /> : <div />;

const Description = ({ items, title, layout, columns }) => {
  if (!items) return null;
  return <Descriptions title={title} bordered items={getDescriptionItems(items)} column={columns} layout={layout} />;
};
Description.defaultProps = {
  items: null,
  layout: "horizontal",
  columns: {
    // xxl: 4,
    xl: 3,
    lg: 3,
    md: 3,
    sm: 2,
    xs: 1,
  },
};
Description.propTypes = {
  layout: propTypes.oneOf(["vertical", "horizontal"]),
  title: propTypes.string.isRequired,
  items: propTypes.object,
  columns: propTypes.shape({
    xxl: propTypes.number,
    xl: propTypes.number,
    lg: propTypes.number,
    md: propTypes.number,
    sm: propTypes.number,
    xs: propTypes.number,
  }),
};
export default Description;
