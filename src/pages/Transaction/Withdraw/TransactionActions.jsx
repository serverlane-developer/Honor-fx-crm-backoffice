import React, { useState } from "react";
import propTypes from "prop-types";
import lo from "lodash";
import { Button, Popconfirm, message } from "antd";
import Endpoints from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";

const actions = {
  retry_rpa: {
    label: "Retry RPA Task",
    endpoint: Endpoints.RETRY_WITHDRAW_TRANSACTION_ON_RPA,
  },
  retry_payout: {
    label: "Retry Trasnsaction On Gateway",
    endpoint: Endpoints.RETRY_WITHDRAW_TRANSACTION_ON_PAYOUT,
  },
  refresh_status: {
    label: "Refresh Payment Status",
    endpoint: Endpoints.REFRESH_PAYMENT_STATUS,
  },
  refund: {
    label: "Refund Transaction",
    endpoint: Endpoints.REFUND_WITHDRAW_TRANSACTION,
  },
  refresh_pg_status: {
    label: "Refresh Pg Transaction Status",
    endpoint: Endpoints.REFRESH_PG_WITHDRAW_TRANSACTION_STATUS,
  },
};

const allowedActions = Object.keys(actions);

const TransactionAction = ({ action, id, onSuccess }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestToggleConfirmation = () => {
    setPopupOpen(true);
  };

  const cancelPopup = () => {
    setPopupOpen(false);
  };
  const actionConfig = actions[action];
  if (!actionConfig) {
    return (
      <div>
        Action Should be one of{" "}
        {Object.keys(allowedActions)
          .map((x) => lo.startCase(x.split("_").join(" ")))
          .join(", ")}
      </div>
    );
  }
  const { label, endpoint } = actionConfig;

  const onToggle = async (transactionId) => {
    const url = `${Endpoints.BASE_URL}${endpoint.url}/${transactionId}`;
    const { data } = await callApi(endpoint.method, url);
    return data;
  };

  const handleToggle = async () => {
    try {
      setIsSubmitting(true);
      const res = await onToggle(id);
      message.success(res?.message);
      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = `Error while ${label}`;
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsSubmitting(false);
      setPopupOpen(false);
    }
  };

  return (
    <div>
      <Popconfirm
        title="Are you sure?"
        // description={label}
        open={popupOpen}
        onConfirm={handleToggle}
        onCancel={cancelPopup}
      >
        <Button loading={isSubmitting} type="primary" disabled={isSubmitting} onClick={requestToggleConfirmation}>
          {label}
        </Button>
      </Popconfirm>
    </div>
  );
};
TransactionAction.propTypes = {
  action: propTypes.oneOf(allowedActions).isRequired,
  id: propTypes.string.isRequired,
  onSuccess: propTypes.func.isRequired,
};

export default TransactionAction;
