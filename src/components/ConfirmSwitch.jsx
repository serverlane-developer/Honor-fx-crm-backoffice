import React, { useState } from "react";
import { Popconfirm, Switch, message } from "antd";
import propTypes from "prop-types";
import getAxiosError from "../helpers/getAxiosError";

const ConfirmSwitch = ({ module, initialState, onToggle, successMessage, checkedLabel, uncheckedLabel, id }) => {
  const [checked, setChecked] = useState(!initialState);

  const [popupOpen, setPopupOpen] = useState(false);
  const [isSwitching, setisSwitching] = useState(false);

  const operation = checked ? "Disable" : "Enable";

  const requestToggleConfirmation = () => {
    setPopupOpen(true);
  };

  const cancelPopup = () => {
    setPopupOpen(false);
    setChecked(checked);
  };

  const handleToggle = async () => {
    try {
      setisSwitching(true);
      const res = await onToggle(id, checked);
      setChecked(!checked);
      message.success(res?.message || successMessage);
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = `Error while toggling ${module} status`;
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
      setChecked(checked);
    } finally {
      setisSwitching(false);
      setPopupOpen(false);
    }
  };

  return (
    <div>
      <Popconfirm
        title="Are you sure?"
        description={`${operation} ${module}`}
        open={popupOpen}
        onConfirm={handleToggle}
        onCancel={cancelPopup}
      >
        <Switch
          loading={isSwitching}
          checkedChildren={checkedLabel}
          unCheckedChildren={uncheckedLabel}
          onChange={requestToggleConfirmation}
          checked={checked}
        />
      </Popconfirm>
    </div>
  );
};
ConfirmSwitch.propTypes = {
  module: propTypes.string.isRequired,
  initialState: propTypes.bool.isRequired,
  onToggle: propTypes.func.isRequired,
  successMessage: propTypes.string.isRequired,
  checkedLabel: propTypes.string,
  uncheckedLabel: propTypes.string,
  id: propTypes.string.isRequired,
};
ConfirmSwitch.defaultProps = {
  checkedLabel: "Enabled",
  uncheckedLabel: "Disabled",
};
export default ConfirmSwitch;
