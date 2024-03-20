import lo from "lodash";
import moment from "moment-timezone";
import appConstants from "../config/appConstants";

export const getModuleName = (module) => lo.startCase(module.split("-").join(" "));
export const parseModuleName = (module) => module.toLowerCase().split(" ").join("-");

export const formatTimestamp = (timestamp) => moment(timestamp).tz(appConstants.timezone).format("DD/MM/YYYY HH:mm:ss");

export const splitAndCapitalise = (text) =>
  text
    .split("_")
    .map((x) => lo.startCase(x))
    .join(" ");
